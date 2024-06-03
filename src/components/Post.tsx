import { Job } from "@/App"
import { Building2, CircleCheckBig, CircleX, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardDescription, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogClose, DialogContent, DialogTrigger, } from "@/components/ui/dialog"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Label } from "@/components/ui/label"
import { ChangeEvent, useState } from "react"
import { useToast } from "./ui/use-toast"
import { db, storage } from "@/lib/firebase"
import { Progress } from "./ui/progress"
import emailjs from '@emailjs/browser';
import { ScrollArea } from "./ui/scroll-area"
import { Textarea } from "./ui/textarea"
import { doc, setDoc } from "firebase/firestore"

export default function Post({ item, setData, admin }: { item: Job, setData: React.Dispatch<React.SetStateAction<Job[]>>, admin: boolean }) {
  const { toast } = useToast()

  const [submitted, setSubmitted] = useState(localStorage.getItem(item.id) || "");

  const [file, setFile] = useState<File | null>();
  const [progress, setProgress] = useState(0);

  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState<number | undefined>();
  const [open, setOpen] = useState(false);
  const [over, setOver] = useState<boolean>(item.totalApplications==0? false : item.applicationsSubmitted >= item.totalApplications);



  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files.length > 1) {
        toast({
          variant: "destructive",
          title: "Uh oh!",
          description: "Du kan bare laste opp én fil om gangen.",
        })
        setFile(null);
        return
      }
      if (e.target.files[0].size > 1024 * 1024 * 5) {
        toast({
          variant: "destructive",
          title: "Uh oh!",
          description: "Filen din skal være mindre enn 5 MB",
        })
        setFile(null);
        return
      }
      setFile(e.target.files[0]);
    }
  };


  const handleUpload = async () => {
    if (!file) {
      return "";
    }

    const storageRef = ref(storage, `pdf/${file?.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        console.log('Upload is ' + progress + '% over');
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
    );
    return await getDownloadURL(uploadTask.snapshot.ref);

  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const resume = await handleUpload()

    emailjs.send("service_f0hbws8", "template_5h4l1dl", {
      title: item.title,
      to_email: item.to_email,
      name, email, phone, link: resume, about_yourself: text
    }, "2OrzLXsspxRe5a38n")
      .then((result) => {
        console.log(result.text);
        toast({
          title: "Suksess!",
          description: "Søknaden din er sendt inn.",
        })
        setDoc(doc(db, "posts", item.id), {
          ...item, applicationsSubmitted: item?.applicationsSubmitted + 1
        });
        setData((prevData) => prevData.map((job) => job.id === item.id ? { ...job, applicationsSubmitted: job.applicationsSubmitted + 1 } : job));
        setSubmitted("true")
        localStorage.setItem(item.id, "true")
        if (item.applicationsSubmitted == item.totalApplications - 1) {
          setOver(true)
        }
        setOpen(false)
     
        setFile(null)
        setProgress(0)
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! ",
          description: error,
        })
        console.error('Error sending email:', error);
      });
    

  }

  const handleLocationClick = () => {
    // Replace this with your preferred map URL generation logic
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`;
    window.open(mapUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger className={`text-left hover:bg-muted mb-3 p-2 rounded-md w-full ${submitted && "bg-green-100 hover:bg-green-50 text-white cursor-not-allowed"} ${over == true ? "cursor-not-allowed bg-muted" : ""} `}>
        <div className="flex gap-3 w-full text-bold">
          <div className=" flex justify-center items-center  w-20 h-20 bg-purple-700">
            {item.logo?.length > 1 ? <img src={item.logo} alt="" className="w-full h-full object-cover" /> : <Building2 color="white" size={30} />}
          </div>
          <div className="flex flex-col flex-1  gap-2 relative">
            <div className="flex justify-between ">
              <h1 className="text-xl font-semibold text-purple-700 truncate" >{item?.title?.length > 50 ? item.title?.substring(0, 50) + "..." : item.title}</h1>
              {submitted && <div className={`text-sm text-green-600 font-semibold inline-flex gap-2  ${admin == true && "mr-16 mt-1"}`}>
                <CircleCheckBig color="green" size={20} /> Søknad sendt inn
              </div>}
            </div>
            <p className="text-sm text-gray-600 font-semibold" >{item?.description?.length > 70 ? item?.description?.substring(0, 70) + "..." : item.description}</p>

            <div className="flex justify-between text-sm text-purple-800 font-semibold">
              <div>
                {item.positionsAvailable}/{item.totalPositions} Stillinger tilgjengelig
              </div>
             {over==false? <div>
                {item.applicationsSubmitted}{item.totalApplications==0? "":`${"/"+item.totalApplications}`} Søknader sendt inn
              </div>: <div className="text-red-600 inline-flex gap-2"><CircleX color="red" size={20} />Søknader stengt</div>}
            </div>

          </div>
        </div>
      </DialogTrigger>
      {!submitted && !over && <DialogContent className="md:min-w-[800px] ">
        <div className="grid grid-cols-6 md:grid-cols-12 gap-3 h-full">

          <div className="col-span-6 h-full flex flex-col gap-3">
            <div className="w-full grid gap-1 grid-cols-4">
              <div className="flex col-span-1 justify-center items-center w-20 h-20  bg-purple-700">
                {item.logo?.length > 1 ? <img src={item.logo} alt="" className="w-full h-full object-cover" /> : <Building2 color="white" size={30} />}
              </div>
              <div className="text-3xl text-wrap h-full col-span-3 capitalize font-semibold text-purple-900 flex items-center ">
                {item.company}
              </div>
            </div>
            <div className="text-xl font-semibold text-purple-700 " >{item.title}</div>

            <ScrollArea className="text-sm text-gray-600 h-52" >
              <CardDescription className="whitespace-pre-line">{item.description}</CardDescription>
            </ScrollArea>

            <div className="flex flex-col justify-between  text-sm text-purple-800 gap-3 font-semibold mt-auto">
              <div onClick={handleLocationClick} className="inline-flex gap-1 cursor-pointer">
                <MapPin />{item.location}
              </div>
              <div className="flex gap-3 ">

                <a href={`tel:${item.phone}`} className="inline-flex gap-1">
                  <Phone />{item.phone}
                </a>


                <a href={`mailto:${item.to_email}`} className="inline-flex gap-1">
                  <Mail />{item.to_email}
                </a>

              </div>
            </div>

          </div>
          <div className="col-span-6">
            <form onSubmit={submit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Navn</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} type="text" required placeholder="Navn " />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email " />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(Number(e.target.value))} type="number" required placeholder="Telefon " />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="about yourself">Om deg selv</Label>
                  <Textarea id="about yourself" value={text} onChange={(e) => setText(e.target.value)} required placeholder="Om deg selv " />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="resume">Legg ved CV</Label>
                  <Input id="resume" type="file" onChange={handleFileChange} accept="application/pdf" required placeholder="cv" />
                </div>
                {progress > 0 && <Progress value={progress} className="" />}
                <div className="flex justify-between ">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" className="mr-auto">
                    Avbryt
                    </Button>
                  </DialogClose>
                  <Button className="bg-purple-700 text-white w-full ml-2 " >Sende inn</Button>

                </div>
              </div>

            </form>
          </div>
        </div>

      </DialogContent>
      }
    </Dialog>
  )
}
