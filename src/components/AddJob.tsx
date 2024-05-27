import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChangeEvent, useState } from "react"
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
import { Building2, LockOpen } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { addDoc, collection } from "firebase/firestore"
import { db, storage } from "@/lib/firebase"
import { Job } from "@/App"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Progress } from "./ui/progress"

export default function AddJob({ setData }: { setData: React.Dispatch<React.SetStateAction<Job[]>> }) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState<number | undefined>();
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState<File | null>();
  const [logo, setLogo] = useState("");
  const [progress, setProgress] = useState(0);
  const [description, setDescription] = useState("");
  const [totalPositions, setTotalPositions] = useState(0);
  const [totalSurveys, setTotalSurveys] = useState(0);

  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await handleUpload()

      console.log(logo)

      const docRef = await addDoc(collection(db, "posts"), {
        title, description, totalPositions, totalSurveys, positionsAvailable: totalPositions, surveysSubmitted: 0, logo, company, phone, to_email:email, location
      });

      setData((prevData) => [
        { title, logo, description, totalPositions, totalSurveys, id: docRef.id, positionsAvailable: totalPositions, surveysSubmitted: 0, company, phone, to_email:email, location },
        ...prevData,
      ]);

      setTitle("");
      setDescription("");
      setTotalPositions(0);
      setTotalSurveys(0);
      setFile(null);
      setLogo("");
      setProgress(0);
      setCompany("");
      setPhone(undefined);
      setEmail("");


      toast({
        title: "Job added successfully!",
        description: "Your job has been added to the job list.",
      })
      setOpen(false);
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
        <Button variant="outline" className="inline-flex items-center gap-2">Add job <LockOpen size={20} /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle> Add New Job Post </DialogTitle>
          <DialogDescription>
            Enter your job details below to add to the job list.
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
                  ) : <Building2 color="white" size={30} />}
                </div>
                <div className="col-span-3 grid gap-2" >
                  <Label htmlFor="logo">Logo</Label>
                  <div className="flex gap-2">

                  <Input id="logo" className="col-span-3" type="file" onChange={handleFileChange} accept="image/png, image/jpeg" placeholder="logo " />
                 {file && <Button type="button" onClick={() => setFile(null)}>Remove</Button>}
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
