import os
import uuid
import shutil
from celery import Celery
import json
import importlib
import sys
import asyncio
import nest_asyncio

import time

from .graphql.utils import get_ezkl

from .graphql.models import (
    Artifact as model_Artifact,
    SolidityArtifact as model_SolidityArtifact,
    Proof as model_Proof,
    SRS
)


celery = Celery("hub")
celery.conf.broker_url = os.getenv(
    "CELERY_BROKER_URL", "amqp://test:test@localhost:5672/")
celery.conf.result_backend = os.getenv(
    "CELERY_RESULT_BACKEND", "redis://:redis@localhost:6379/0"
)


# celery.conf.broker_url = os.getenv(
#     "redis://redis-service:6379/0", "redis://redis-service:6379/0"
# )
# celery.conf.result_backend = os.getenv(
#     "redis://redis-service:6379/0", "redis://redis-service:6379/0"
# )


ENV = os.getenv("ENV")

ARTIFACT_PATH = os.path.join(os.getcwd(), "artifact")


@celery.task(name="prove")
def prove(
    temp_uuid,
    model_uuid,
    input_path,
    model_path,
    settings_path,
    pk_path,
    srs_path,
    transcript_type,
    strategy,
):

    start_time = time.time()

    # get version from settings
    with open(settings_path, "r") as f:
        settings_data = json.load(f)

    ezkl = get_ezkl(settings_data["version"])

    witness_path = os.path.join(
        ARTIFACT_PATH, model_uuid, "temp", str(temp_uuid) + "_witness" + ".json"
    )

    shutil.copy(input_path, witness_path)

    if settings_data["version"] in ("1.27.0", "2.5.0", "latest"):
        ezkl.gen_witness(
            input_path,
            model_path,
            witness_path,
        )
    else:
        ezkl.gen_witness(input_path, model_path, witness_path, settings_path)

    proof_path = os.path.join(
        ARTIFACT_PATH, model_uuid, "temp", str(temp_uuid) + "_proof" + ".json"
    )

    if settings_data["version"] in ("1.27.0"):
        proof = ezkl.prove(
            witness_path,
            model_path,
            pk_path,
            proof_path,
            srs_path,
            transcript_type,
            strategy,
        )
    elif settings_data["version"] in ("2.5.0", "latest"):
        proof = ezkl.prove(
            witness_path,
            model_path,
            pk_path,
            proof_path,
            srs_path,
            strategy,
        )
    else:
        proof = ezkl.prove(
            witness_path,
            model_path,
            pk_path,
            proof_path,
            srs_path,
            transcript_type,
            strategy,
            settings_path,
        )

    onchain_input_array = []

    for value in proof["instances"]:
        for field_element in value:
            print(field_element)
            onchain_input_array.append(str(ezkl.vecu64_to_int(field_element)))


    end_time = time.time()

    time_taken = int(end_time - start_time)

    # Update the database
    from .main import create_app
    app = create_app()
    with app.app_context():
        new_proof = model_Proof(
            id=temp_uuid,
            artifact_id=model_uuid,
            time_taken=time_taken,
            status="SUCCESS",
            proof= "0x" + proof["proof"],
            instances=onchain_input_array,
            transcript_type=transcript_type,
            strategy=strategy
        )

        new_proof.save()

    res = {
        "taskId": str(temp_uuid),
        "artifactId": model_uuid,
        "proof": "0x" + proof["proof"],
        "proofFile": proof_path,
        "instances": onchain_input_array,
        "transcript_type": proof["transcript_type"].lower(),
        "strategy": strategy,
        "version": settings_data["version"],
    }

    return res


@celery.task(name="prove_aggregate")
def prove_aggregate(results, nb):
    # use the first element for the ezkl version we use
    ezkl = get_ezkl(results[0]["version"])

    aggr_proof_path = os.path.join(
        ARTIFACT_PATH,
        str(nb["artifactId"]),
        "temp",
        str(nb["taskId"]) + "_proof" + ".json",
    )

    proof_paths = [result["proofFile"] for result in results]

    proof = ezkl.aggregate(
        aggr_proof_path,
        proof_paths,
        nb["pk"],
        nb["srs_path"],
        "evm",
        nb["logrows"],
        "safe",
    )

    onchain_input_array = []

    with open(aggr_proof_path, "r") as f:
        proof = json.load(f)

    for value in proof["instances"]:
        for field_element in value:
            print(field_element)
            onchain_input_array.append(str(ezkl.vecu64_to_int(field_element)))

    res = {
        "artifactId": str(nb["artifactId"]),
        # Todo to convert to byte string instead
        "proof": ezkl.print_proof_hex(aggr_proof_path),
        "proofFile": aggr_proof_path,
        "instances": onchain_input_array,
        "transcript_type": proof["transcript_type"].lower(),
        "strategy": "aggregate",
        "children": results,
    }

    return res



@celery.task(name="generate_verifier")
def validate(
    temp_uuid,
    model_uuid,
    input_path,
    model_path,
    settings_path,
    pk_path,
    vk_path,
    srs_path,
):
    # get version from settings
    with open(settings_path, "r") as f:
        settings_data = json.load(f)

    ezkl = get_ezkl(settings_data["version"])

    # generate the vk
    res = ezkl.gen_vk_from_pk_single(pk_path, settings_path, vk_path)

    # check if task completed successfully else raise AssertionError
    assert res

    # generate proof

    witness_path = os.path.join(
        ARTIFACT_PATH, model_uuid, "temp", str(temp_uuid) + "_witness" + ".json"
    )

    shutil.copy(input_path, witness_path)

    if settings_data["version"] in ("1.27.0", "2.5.0", "latest"):
        ezkl.gen_witness(
            input_path,
            model_path,
            witness_path,
        )
    else:
        ezkl.gen_witness(
            input_path,
            model_path,
            witness_path,
            settings_path
        )

    proof_path = os.path.join(
        ARTIFACT_PATH, model_uuid, "temp", str(temp_uuid) + "_proof" + ".json"
    )

    if settings_data["version"] in ("1.27.0"):
        proof = ezkl.prove(
            witness_path,
            model_path,
            pk_path,
            proof_path,
            srs_path,
            'evm',
            'single',
        )
    elif settings_data["version"] in ("2.5.0", "latest"):
        proof = ezkl.prove(
            witness_path,
            model_path,
            pk_path,
            proof_path,
            srs_path,
            'single',
        )
    else:
        proof = ezkl.prove(
            witness_path,
            model_path,
            pk_path,
            proof_path,
            srs_path,
            'evm',
            'single',
            settings_path
        )

    # verify
    res = ezkl.verify(proof_path, settings_path, vk_path, srs_path)

    # check if verification is done successfully
    assert res

    # Update the database
    from .main import create_app

    app = create_app()
    with app.app_context():
        artifact_data = model_Artifact.query.filter_by(id=model_uuid).first()
        artifact_data.settings_uploaded = True
        artifact_data.settings_validated = True
        artifact_data.model_uploaded = True
        artifact_data.model_validated = True
        artifact_data.pk_validated = True
        artifact_data.pk_uploaded = True
        artifact_data.vk_validated = True
        artifact_data.vk_uploaded = True
        artifact_data.artifact_validated = True

        artifact_data.save()

    res = {
        "artifactId": model_uuid,
    }

    return res


@celery.task(name="generate_solidity_code")
def generate_solidity_code(temp_uuid, model_uuid, vk_path, srs_path, settings_path):
    with open(settings_path, "r") as f:
        settings_data = json.load(f)

    ezkl = get_ezkl(settings_data["version"])

    sol_code_path = os.path.join(ARTIFACT_PATH, model_uuid, "Verifier.sol")
    abi_path = os.path.join(ARTIFACT_PATH, model_uuid, "Verifier.abi")

    ezkl.create_evm_verifier(vk_path, srs_path, settings_path, sol_code_path, abi_path)

    with open(sol_code_path, "r") as f:
        solidity_code = f.read()

    with open(abi_path, "r") as f:
        abi = f.read()

    # get application context
    from .main import create_app

    app = create_app()
    with app.app_context():
        artifact_data = model_Artifact.query.filter_by(id=model_uuid).first()

        solidity_artifact = model_SolidityArtifact.create(
            artifact=artifact_data, abi=abi, solidity_code=solidity_code
        )

        solidity_artifact.save()

        artifact_data.save()


async def calibrate_settings_sync(
    ezkl, input_path, model_path, settings_path, calibration_target
):
    await ezkl.calibrate_settings(
        input_path, model_path, settings_path, calibration_target
    )


@celery.task(name="generate_artifact")
def generate_artifact(
    temp_uuid,
    model_uuid,
    ezkl_version,
    input_path,
    calibration_target,
    tolerance,
    input_scale,
    param_scale,
    scale_rebase_multiplier,
    bits,
    logrows,
    input_visibility,
    output_visibility,
    param_visibility,
    organization_id
):
    # run the whole flow
    ezkl = get_ezkl(ezkl_version)

    model_path = os.path.join(ARTIFACT_PATH, model_uuid, "network.onnx")
    compiled_model_path = os.path.join(ARTIFACT_PATH, model_uuid, "network.ezkl")
    pk_path = os.path.join(ARTIFACT_PATH, model_uuid, "pk.key")
    vk_path = os.path.join(ARTIFACT_PATH, model_uuid, "vk.key")
    settings_path = os.path.join(ARTIFACT_PATH, model_uuid, "settings.json")
    witness_path = os.path.join(
        ARTIFACT_PATH, model_uuid, "temp", str(temp_uuid) + "_witness" + ".json"
    )
    sol_code_path = os.path.join(ARTIFACT_PATH, model_uuid, "Verifier.sol")
    abi_path = os.path.join(ARTIFACT_PATH, model_uuid, "Verifier.abi")

    # generate pyrunargs
    pyrunargs = ezkl.PyRunArgs()
    pyrunargs.tolerance = tolerance
    pyrunargs.input_scale = input_scale
    pyrunargs.param_scale = param_scale
    pyrunargs.scale_rebase_multiplier = scale_rebase_multiplier
    pyrunargs.bits = bits
    pyrunargs.logrows = logrows
    pyrunargs.input_visibility = input_visibility
    pyrunargs.output_visibility = output_visibility
    pyrunargs.param_visibility = param_visibility

    # generate settings
    res = ezkl.gen_settings(model_path, settings_path, pyrunargs)
    assert res == True

    # calibrate settings
    nest_asyncio.apply()
    loop = asyncio.get_event_loop()
    loop.run_until_complete(
        calibrate_settings_sync(
            ezkl, input_path, model_path, settings_path, calibration_target
        )
    )

    # compile model
    if ezkl_version in ("1.27.0", "2.5.0", "latest"):
        res = ezkl.compile_circuit(model_path, compiled_model_path, settings_path)
        assert res == True
    else:
        res = ezkl.compile_model(model_path, compiled_model_path, settings_path)
        assert res == True

    # set srs_path
    with open(settings_path, "r") as f:
        settings_data = json.load(f)

    # get log rows
    logrows = settings_data["run_args"]["logrows"]

    # get SRS
    srs_value = SRS.get_perpetual_powers_of_tau(logrows)
    srs_path = os.path.join(ARTIFACT_PATH, "srs", srs_value.value + ".srs")

    # run setup
    if ezkl_version in ("1.27.0", "2.5.0", "latest"):
        res = ezkl.setup(
            compiled_model_path,
            vk_path,
            pk_path,
            srs_path,
        )
    else:
        res = ezkl.setup(compiled_model_path, vk_path, pk_path, srs_path, settings_path)
    assert res == True
    assert os.path.isfile(vk_path)
    assert os.path.isfile(pk_path)
    assert os.path.isfile(settings_path)

    # generate witness
    if ezkl_version in ("1.27.0", "2.5.0", "latest"):
        res = ezkl.gen_witness(input_path, compiled_model_path, witness_path)
    else:
        res = ezkl.gen_witness(
            input_path, compiled_model_path, witness_path, settings_path
        )

    assert os.path.isfile(witness_path)

    # generate proof
    proof_path = os.path.join(
        ARTIFACT_PATH, model_uuid, "temp", str(temp_uuid) + "_proof" + ".json"
    )

    if ezkl_version in ("1.27.0"):
        ezkl.prove(
            witness_path,
            compiled_model_path,
            pk_path,
            proof_path,
            srs_path,
            "evm",
            "single",
        )
    elif ezkl_version in ("2.5.0", "latest"):
        proof = ezkl.prove(
            witness_path,
            compiled_model_path,
            pk_path,
            proof_path,
            srs_path,
            "single",
        )
    else:
        ezkl.prove(
            witness_path,
            compiled_model_path,
            pk_path,
            proof_path,
            srs_path,
            "evm",
            "single",
            settings_path,
        )

    assert os.path.isfile(proof_path)

    # verify proof
    res = ezkl.verify(
        proof_path,
        settings_path,
        vk_path,
        srs_path,
    )

    assert res == True

    # create the evm verifier
    res = ezkl.create_evm_verifier(
        vk_path, srs_path, settings_path, sol_code_path, abi_path
    )
    assert res == True
    assert os.path.isfile(sol_code_path)

    with open(sol_code_path, "r") as f:
        solidity_code = f.read()

    with open(abi_path, "r") as f:
        abi = f.read()

    # commit things into the db
    from .main import create_app

    app = create_app()
    with app.app_context():
        artifact_data = model_Artifact.query.filter_by(id=model_uuid).first()
        artifact_data.uncompiled_model_uploaded = True
        artifact_data.uncompiled_model_validated = True
        artifact_data.settings = str(model_uuid) + "/settings.json"
        artifact_data.settings_uploaded = True
        artifact_data.settings_validated = True
        artifact_data.model = str(model_uuid) + "/network.ezkl"
        artifact_data.model_uploaded = True
        artifact_data.model_validated = True
        artifact_data.pk = str(model_uuid) + "/pk.key"
        artifact_data.pk_validated = True
        artifact_data.pk_uploaded = True
        artifact_data.vk = str(model_uuid) + "/vk.key"
        artifact_data.vk_validated = True
        artifact_data.vk_uploaded = True
        artifact_data.artifact_validated = True
        artifact_data.srs = srs_value
        artifact_data.organization_id = organization_id

        solidity_artifact = model_SolidityArtifact.create(
            artifact=artifact_data, abi=abi, solidity_code=solidity_code
        )

        solidity_artifact.save()

        artifact_data.save()


@celery.task(name="generate_aggregate_artifact")
def generate_aggregate_artifact(results, nb):
    # use the first element for the ezkl version we use
    ezkl = get_ezkl(results[0]["version"])

    # get SRS
    srs_value = SRS.get_perpetual_powers_of_tau(nb["logrows"])
    srs_path = os.path.join(ARTIFACT_PATH, "srs", srs_value.value + ".srs")

    # run setup aggregate
    proof_paths = [result["proofFile"] for result in results]
    res = ezkl.setup_aggregate(
        proof_paths,
        nb["vk"],
        nb["pk"],
        srs_path,
        nb["logrows"],
    )

    aggr_proof_path = os.path.join(
        ARTIFACT_PATH,
        str(nb["artifactId"]),
        "temp",
        str(nb["taskId"]) + "_proof" + ".json",
    )

    proof = ezkl.aggregate(
        aggr_proof_path, proof_paths, nb["pk"], srs_path, "evm", nb["logrows"], "safe"
    )

    # create the evm verifier
    sol_code_path = os.path.join(ARTIFACT_PATH, nb["artifactId"], "Verifier.sol")
    abi_path = os.path.join(ARTIFACT_PATH, nb["artifactId"], "Verifier.abi")

    settings_paths = []
    for x in results:
        settings_paths.append(
            os.path.join(ARTIFACT_PATH, x["artifactId"], "settings.json")
        )

    res = ezkl.create_evm_verifier_aggr(
        nb["vk"],
        srs_path,
        sol_code_path,
        abi_path,
        settings_paths,
    )
    assert res == True
    assert os.path.isfile(sol_code_path)

    with open(sol_code_path, "r") as f:
        solidity_code = f.read()

    with open(abi_path, "r") as f:
        abi = f.read()

    # commit things into the db
    from .main import create_app

    app = create_app()
    with app.app_context():
        artifact_data = model_Artifact.query.filter_by(id=nb["artifactId"]).first()
        artifact_data.uncompiled_model_uploaded = True
        artifact_data.uncompiled_model_validated = True
        artifact_data.pk = nb["artifactId"] + "/pk.key"
        artifact_data.pk_validated = True
        artifact_data.pk_uploaded = True
        artifact_data.vk = nb["artifactId"] + "/vk.key"
        artifact_data.vk_validated = True
        artifact_data.vk_uploaded = True
        artifact_data.artifact_validated = True
        artifact_data.srs = srs_value
        artifact_data.organization_id = nb["organizationId"]

        solidity_artifact = model_SolidityArtifact.create(
            artifact=artifact_data, abi=abi, solidity_code=solidity_code
        )

        solidity_artifact.save()

        artifact_data.save()
