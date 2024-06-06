import { ChangeEvent } from "react"
import { Building2, Check, X } from "lucide-react"
import { storage } from "@/lib/firebase"
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { Progress } from "./ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "./ui/use-toast"
import { Job } from "@/App"
import { FilePenLine } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ScrollArea } from "./ui/scroll-area";


export default function EditJob({ item, setData }: { item: Job, setData: React.Dispatch<React.SetStateAction<Job[]>> }) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState(item.title);
  const [company, setCompany] = useState(item.company);
  const [phone, setPhone] = useState<number | undefined>(item.phone);
  const [email, setEmail] = useState(item.to_email);
  const [location, setLocation] = useState(item.location);
  const [file, setFile] = useState<File | null>();
  const [logo, setLogo] = useState(item.logo || "");
  const [description, setDescription] = useState(item.description);
  const [totalPositions, setTotalPositions] = useState(item.totalPositions);
  const [positionsAvailable, setPositionsAvailable] = useState(item.positionsAvailable);
  const [totalApplications, setTotalApplications] = useState(item.totalApplications);


  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      let uploadedLogo;
      if (file) {
        try {
          uploadedLogo = await handleUpload() as string;
        } catch (error) {
          console.error("Error uploading file:", error);
          // Handle upload error (e.g., display an error message to the user)
          return; // Exit the function if upload fails
        }
      } else {
        uploadedLogo = logo; // Use the existing logo URL if no file is selected
      }

      await setDoc(doc(db, "posts", item.id), {
        title, description, totalPositions, totalApplications, positionsAvailable, applicationsSubmitted: item?.applicationsSubmitted, logo: uploadedLogo, company, phone, to_email: email, location
      });
      setData((prevData) => prevData.map((job) => job.id === item.id ? { ...job, title, description, positionsAvailable, totalPositions, totalApplications, logo: uploadedLogo, company, phone, to_email: email, location } : job));

      setOpen(false);
      setProgress(0);

      toast({
        title: "Job edited successfully!",
        description: "Your job has been edited.",
      })


    } catch (error) {
      console.error("Error getting posts:", error);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
      return
    }

  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files.length > 1) {
        toast({
          variant: "destructive",
          title: "Uh oh!",
          description: "You can only upload one file at a time.",
        })
        setFile(null);
        return
      }
      if (e.target.files[0].size > 1024 * 1024 * 5) {
        toast({
          variant: "destructive",
          title: "Uh oh!",
          description: "Your file should be less than 5MB",
        })
        setFile(null);
        return
      }
      setFile(e.target.files[0]);
    }
  };


  const handleUpload = async () => {
    if (!file) {
      return logo;
    }
    setProgress(10)
    const storageRef = ref(storage, `logo/${file?.name}`);
    await uploadBytes(storageRef, file);
    setProgress(50);

    return await getDownloadURL(storageRef);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <FilePenLine className="hover:text-green-700 h-5 w-5" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px] h-full sm:h-max ">
        <ScrollArea className="h-full">

          <DialogHeader>
            <DialogTitle> Edit Job Post  </DialogTitle>
            <DialogDescription>
              Edit the job post below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={add} className="grid mt-3 gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">


              <div className="grid cols-span-4 items-center gap-4">
                <div className="grid grid-cols-4 items-center gap-4 w-full">
                  <div className="col-span-1 flex justify-center items-center w-20 h-20 bg-purple-700">

                    {file != null ? (
                      <>
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                      </>
                    ) : <>
                      {logo?.length > 1 ? <img src={logo} alt="" className="w-full h-full object-cover" /> : <Building2 color="white" size={30} />}
                    </>}
                  </div>
                  <div className="col-span-3 grid gap-2" >
                    <Label htmlFor="logo">Logo</Label>
                    <div className="flex gap-2">

                      <Input id="logo" className="col-span-3" type="file" onChange={handleFileChange} accept="image/png, image/jpeg" placeholder="logo " />
                      {file && <Button type="button" onClick={() => setFile(null)}>Remove</Button>}
                      {logo?.length > 1 && file == null && <Button type="button" onClick={() => setLogo("")}>Remove</Button>}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    className="col-span-3"
                    id="company"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="Company"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location">location</Label>
                  <Input
                    className="col-span-3"
                    id="location"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="location"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone">phone</Label>
                  <Input
                    className="col-span-3"
                    id="phone"
                    type="number"
                    value={phone}
                    onChange={e => setPhone(Number(e.target.value))}
                    placeholder="1234242424"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email">email</Label>
                  <Input
                    className="col-span-3"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email"
                    required
                  />
                </div>

              </div>
              <div className="grid cols-span-4 items-center gap-4">

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    className="col-span-3"
                    id="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Job title"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    className="col-span-3"
                    id="description"
                    rows={6}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="A job description goes here"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="totalPositions">Total Positions</Label>
                  <Input
                    className="col-span-3"
                    id="totalPositions"
                    type="number"
                    value={totalPositions}
                    min={1}
                    onChange={e => setTotalPositions(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="totalPositions">Positions Available</Label>
                  <Input
                    className="col-span-3"
                    id="totalPositions"
                    type="number"
                    value={positionsAvailable}
                    min={1}
                    onChange={e => setPositionsAvailable(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="Total Applications">Total Applications</Label>
                  <div className="flex gap-2 w-full col-span-3">

                    <Input
                      className=""
                      type="number"
                      id="totalApplications"
                      value={totalApplications}
                      onChange={(e) => setTotalApplications(Number(e.target.value))}
                      required
                    />
                    <Button type="button" className="inline-flex gap-2" variant={"secondary"} onClick={() => setTotalApplications(0)}>{totalApplications == 0 ? <Check color="green" size={20} /> : <X color="red" size={20} />}No limit</Button>
                  </div>
                </div>
              </div>

            </div>

            {progress > 0 && <Progress value={progress} className="" />}
            <DialogFooter>
              <Button type="submit" disabled={progress > 0} className="w-full">Edit Job</Button>
            </DialogFooter>
          </form>
        </ScrollArea>

      </DialogContent>
    </Dialog>
  )
}
