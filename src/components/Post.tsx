import { Job } from "@/App"
import { Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Label } from "@/components/ui/label"
import { ChangeEvent, useState } from "react"
import { useToast } from "./ui/use-toast"
import { storage } from "@/lib/firebase"
import { Progress } from "./ui/progress"

export default function Post({ item }: { item: Job }) {
  const { toast } = useToast()
  console.log(item)

  const [file, setFile] = useState<File | null>();
  const [progress, setProgress] = useState(0);

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


  const handleUpload = () => {
    if (!file) {
      return;
    }

    const storageRef = ref(storage, `pdf/${file?.name}`);
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
          console.log('File available at', downloadURL);
        });
      }
    );

  };

  return (
    <Dialog >
      <DialogTrigger className="text-left hover:bg-muted mb-3 p-2 rounded-md w-full ">
        <div className="grid grid-cols-7 gap-3 w-full text-bold">
          <div className="col-span-1 flex justify-center items-center  bg-purple-700">
            {item.logo?.length > 1 ?   <img src={item.logo} alt="" /> : <Building2 color="white" size={30} />}
            {/* <Building2 color="white" size={30} /> */}
            {/* <Avatar>
              <AvatarImage src="" />
              <AvatarFallback></AvatarFallback>
            </Avatar> */}
          </div>
          <div className="col-span-6 grid gap-2 relative">
            <h1 className="text-xl font-semibold text-purple-700 " >{item?.title?.length > 50 ? item.title?.substring(0, 50) + "..." : item.title}</h1>
            <p className="text-sm text-gray-600 font-semibold" >{item?.description?.substring(0, 70) + "..."}</p>

            <div className="flex justify-between text-sm text-purple-800 font-semibold">
              <div>
                {item.positionsAvailable}/{item.totalPositions} Positions Available
              </div>
              <div>
                {item.surveysSubmitted}/{item.totalSurveys} Surveys submitted
              </div>
            </div>

          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[800px]">
        <div className="grid grid-cols-12 gap-2">

          <div className="col-span-6">
            <div className="col-span-1 flex justify-center items-center w-20 h-20  bg-purple-700">
              <Building2 color="white" size={30} />
              {/* <Avatar>
              <AvatarImage src="" />
              <AvatarFallback></AvatarFallback>
            </Avatar> */}
            </div>
            <div className="text-xl font-semibold text-purple-700 " >{item.title}</div>
            <CardDescription className="">{item.description}</CardDescription>

          </div>
          <div className="col-span-6">
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Name " />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Email " />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="number" placeholder="Phone " />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="resume">Attach Resume</Label>
                  <Input id="resume" type="file" onChange={handleFileChange} accept="application/pdf" placeholder="Resume " required />
                </div>
                  <Progress value={progress} className="" />
                <div className="flex justify-between ">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" className="mr-auto">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="button" className="bg-purple-700 text-white w-full ml-2 " onClick={handleUpload} >Submit</Button>

                </div>
              </div>

            </form>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}
