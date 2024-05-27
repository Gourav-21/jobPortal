import { ChangeEvent } from "react"
import { Building2 } from "lucide-react"
import { storage } from "@/lib/firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
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



export function ditJob({ item, setData }: { item: Job, setData: React.Dispatch<React.SetStateAction<Job[]>> }) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [totalPositions, setTotalPositions] = useState(item.totalPositions);
  const [positionsAvailable, setPositionsAvailable] = useState(item.positionsAvailable);
  const [totalSurveys, setTotalSurveys] = useState(item.totalSurveys);

  async function edit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await setDoc(doc(db, "posts", item.id), {
      title, description, totalPositions, totalSurveys, positionsAvailable, surveysSubmitted: item?.surveysSubmitted
    });
    setData((prevData) => prevData.map((job) => job.id === item.id ? { ...job, title, description, positionsAvailable, totalPositions, totalSurveys } : job));
    setOpen(false);
    toast({
      title: "Job edited successfully!",
      description: "Your job has been edited.",
    })
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <FilePenLine className="hover:text-green-700 h-5 w-5" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> Edit Job Post  </DialogTitle>
          <DialogDescription>
            Edit the job post below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={edit} className="grid gap-4 py-4">
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
            <Label htmlFor="totalSurveys">total surveys</Label>
            <Input
              className="col-span-3"
              type="number"
              id="totalSurveys"
              value={totalSurveys}
              min={1}
              onChange={(e) => setTotalSurveys(Number(e.target.value))}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">Save Edit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}



export default function EditJob({ item, setData }: { item: Job, setData: React.Dispatch<React.SetStateAction<Job[]>> }) {
  console.log(item)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState(item.title);
  const [company, setCompany] = useState(item.company);
  const [phone, setPhone] = useState<number | undefined>(item.phone);
  const [email, setEmail] = useState(item.to_email);
  const [location, setLocation] = useState(item.location);
  const [file, setFile] = useState<File | null>();
  const [logo, setLogo] = useState(item.logo);
  const [description, setDescription] = useState(item.description);
  const [totalPositions, setTotalPositions] = useState(item.totalPositions);
  const [positionsAvailable, setPositionsAvailable] = useState(item.positionsAvailable);
  const [totalSurveys, setTotalSurveys] = useState(item.totalSurveys);

  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (file)
        await handleUpload()

      console.log(logo)

      await setDoc(doc(db, "posts", item.id), {
        title, description, totalPositions, totalSurveys, positionsAvailable, surveysSubmitted: item?.surveysSubmitted, logo, company, phone, to_email: email, location
      });
      setData((prevData) => prevData.map((job) => job.id === item.id ? { ...job, title, description, positionsAvailable, totalPositions, totalSurveys, logo, company, phone, to_email: email, location } : job));

      setOpen(false);
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
      return;
    }

    const storageRef = ref(storage, `logo/${file?.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setLogo(downloadURL);
        });
      }
    );

  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <FilePenLine className="hover:text-green-700 h-5 w-5" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle> Edit Job Post  </DialogTitle>
          <DialogDescription>
            Edit the job post below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={add} className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 items-center gap-4">


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
                    {logo?.length > 1 && file==null && <Button type="button" onClick={() => setLogo("")}>Remove</Button>}
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
                <Label htmlFor="totalPositions">Positions Available</Label>
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
                <Label htmlFor="totalSurveys">Total Surveys</Label>
                <Input
                  className="col-span-3"
                  type="number"
                  id="totalSurveys"
                  value={totalSurveys}
                  min={1}
                  onChange={(e) => setTotalSurveys(Number(e.target.value))}
                  required
                />
              </div>
            </div>

          </div>

          <Progress value={progress} className="" />
          <DialogFooter>
            <Button type="submit" className="w-full">Add Job</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
