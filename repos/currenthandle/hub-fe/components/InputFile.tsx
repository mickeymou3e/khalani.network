import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InputFile() {
  return (
    <div className="grid w-full items-center gap-1.5 lg:max-w-sm">
      <Label htmlFor="picture">Picture</Label>
      <Input
        id="picture"
        type="file"
        className="border-blue-600 file:rounded-md file:border file:border-solid file:border-blue-700 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
  );
}
