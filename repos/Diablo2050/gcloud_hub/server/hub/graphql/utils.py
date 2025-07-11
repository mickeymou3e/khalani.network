try:
    import ezkl_wheels.ezkl_1_11_5.ezkl
    import ezkl_wheels.ezkl_1_12_3.ezkl
    import ezkl_wheels.ezkl_1_12_8.ezkl
    import ezkl_wheels.ezkl_1_13_2.ezkl
    import ezkl_wheels.ezkl_1_16_0.ezkl
    import ezkl_wheels.ezkl_1_17_2.ezkl
    import ezkl_wheels.ezkl_1_18_0.ezkl
    import ezkl_wheels.ezkl_1_19_2.ezkl
    import ezkl_wheels.ezkl_1_21_1.ezkl
    import ezkl_wheels.ezkl_1_22_1.ezkl
    import ezkl_wheels.ezkl_1_24_0.ezkl
    import ezkl_wheels.ezkl_1_25_0.ezkl
    import ezkl_wheels.ezkl_1_27_0.ezkl
    import ezkl_wheels.ezkl_2_5_0.ezkl
except ImportError:
    # Do nothing so the build do not fail
    pass


def get_ezkl(version):
    if version == "1.11.5":
        ezkl = ezkl_wheels.ezkl_1_11_5.ezkl

    elif version == "1.12.3":
        ezkl = ezkl_wheels.ezkl_1_12_3.ezkl

    elif version == "1.12.8":
        ezkl = ezkl_wheels.ezkl_1_12_8.ezkl

    elif version == "1.13.2":
        ezkl = ezkl_wheels.ezkl_1_13_2.ezkl

    elif version == "1.16.0":
        ezkl = ezkl_wheels.ezkl_1_16_0.ezkl

    elif version == "1.17.2":
        ezkl = ezkl_wheels.ezkl_1_17_2.ezkl

    elif version == "1.18.0":
        ezkl = ezkl_wheels.ezkl_1_18_0.ezkl

    elif version == "1.19.2":
        ezkl = ezkl_wheels.ezkl_1_19_2.ezkl

    elif version == "1.21.1":
        ezkl = ezkl_wheels.ezkl_1_21_1.ezkl

    elif version == "1.22.1":
        ezkl = ezkl_wheels.ezkl_1_22_1.ezkl

    elif version == "1.24.0":
        ezkl = ezkl_wheels.ezkl_1_24_0.ezkl

    elif version == "1.25.0":
        ezkl = ezkl_wheels.ezkl_1_25_0.ezkl

    elif version == "1.27.0":
        ezkl = ezkl_wheels.ezkl_1_27_0.ezkl

    elif version == "2.5.0":
        ezkl = ezkl_wheels.ezkl_2_5_0.ezkl

    else:
        # default to latest version
        ezkl = ezkl_wheels.ezkl_2_5_0.ezkl

    return ezkl


def is_valid_ezkl_version(version):
    # TODO: change this to a set
    if version == "1.11.5":
        return True
    elif version == "1.12.3":
        return True
    elif version == "1.12.8":
        return True
    elif version == "1.13.2":
        return True
    elif version == "1.16.0":
        return True
    elif version == "1.17.2":
        return True
    elif version == "1.18.0":
        return True
    elif version == "1.19.2":
        return True
    elif version == "1.21.1":
        return True
    elif version == "1.22.1":
        return True
    elif version == "1.24.0":
        return True
    elif version == "1.25.0":
        return True
    elif version == "1.27.0":
        return True
    elif version == "2.5.0":
        return True
    elif version == "latest":
        return True
    else:
        return False