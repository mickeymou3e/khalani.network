import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
export default function Overview() {
  return (
    <div className="grid-rows-24 grid h-full min-h-full w-full grid-cols-12 text-white lg:px-24">
      {/* Col 1: Main Nav */}
      <div className="col-span-2 col-start-1 row-span-full space-y-6 border-r-[1px] border-[#333333] pt-10">
        <h2>Getting Started</h2>
      </div>
      <div className="col-span-8  space-y-6 p-8">
        <div>
          <h3 id="overview" className="text-2xl">
            Overview
          </h3>
          <p>
            There are two options for creating an artifact. You can upload an
            ONNX file and a sample input, or you can upload all the
            cryptographic components of an ezkl setup you have already
            performed. Create a new artifact using the Create Artifact button on
            the Dashboard.
          </p>
          <p>
            There are two options for creating an artifact. You can upload an
            ONNX file and a sample input, or you can upload all the
            cryptographic components of an ezkl setup you have already
            performed. Create a new artifact using the Create Artifact button on
            the Dashboard.
          </p>
          <p>
            There are two options for creating an artifact. You can upload an
            ONNX file and a sample input, or you can upload all the
            cryptographic components of an ezkl setup you have already
            performed. Create a new artifact using the Create Artifact button on
            the Dashboard.
          </p>
          <p>
            There are two options for creating an artifact. You can upload an
            ONNX file and a sample input, or you can upload all the
            cryptographic components of an ezkl setup you have already
            performed. Create a new artifact using the Create Artifact button on
            the Dashboard.
          </p>
          <p>
            There are two options for creating an artifact. You can upload an
            ONNX file and a sample input, or you can upload all the
            cryptographic components of an ezkl setup you have already
            performed. Create a new artifact using the Create Artifact button on
            the Dashboard.
          </p>
        </div>
        <div className="space-y-6">
          <h3 id="artifact" className="text-2xl">
            Artifact
          </h3>
          <p>
            An artifact contains all the data needed to create and verify an
            EZKL proof.
          </p>
          <p>
            There are two options for creating an artifact. You can upload an
            ONNX file and a sample input, or you can upload all the
            cryptographic components of an ezkl setup you have already
            performed. Create a new artifact using the Create Artifact button on
            the Dashboard.
          </p>
        </div>

        <h3 id="proof" className="text-2xl">
          Proving
        </h3>
        <p>Artifacts you have created are displayed on the Dashboard.</p>
        <p>Click on an individual artifact card to see the details.</p>
        <p>
          From there you can view the ONNX graph and settings, and request a
          proof by uploading a new input.
        </p>
        <p>
          When the proof is ready, you can copy it to your clipboard with the
          Copy button.
        </p>
      </div>
      <div className="col-span-2 flex flex-col space-y-6 border-l-[1px] border-[#333333] pl-10 pt-4">
        <Link href="#overview">Overview</Link>
        <Link href="#artifacts">Artifacts</Link>
        <Link href="#proof">Proof</Link>
      </div>
    </div>
  );
}
