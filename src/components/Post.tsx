import { Job } from "@/App"
import { Building2, CircleCheckBig, CircleX, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardDescription, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogClose, DialogContent, DialogTrigger, } from "@/components/ui/dialog"
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
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
  const [over, setOver] = useState<boolean>(item.totalApplications == 0 ? false : item.applicationsSubmitted >= item.totalApplications);



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
      return "";
    }
    setProgress(10);


    const storageRef = ref(storage, `pdf/${file?.name}`);
    await uploadBytes(storageRef, file);
    setProgress(70);

    return await getDownloadURL(storageRef);

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
          title: "Success!",
          description: "Your application has been submitted successfully.",
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
        setProgress(0)
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

          <div className=" flex justify-center items-center w-14 h-14  md:w-20 md:h-20 bg-purple-700">
            {item.logo?.length > 1 ? <img src={item.logo} alt="" className="w-full h-full object-cover" /> : <Building2 color="white" size={30} />}
          </div>

          <div className="flex flex-col grow w-10  gap-2 relative">
            <div className="flex justify-between text-nowrap">
              <h1 className="text-lg md:text-xl font-semibold text-purple-700 truncate" >{item.title}</h1>
              {submitted && <div className={`text-xs md:text-sm text-green-600 font-semibold   ${admin == true && "mr-16 mt-1"}`}>
                <div className="md:hidden inline-flex items-center gap-2">
                  <CircleCheckBig color="green" size={20} /> Submitted
                </div>
                <div className="hidden md:inline-flex gap-2">
                  <CircleCheckBig color="green" size={20} /> Application Submitted
                </div>
              </div>}
            </div>

            <p className="text-xs md:text-sm text-gray-600 font-semibold line-clamp-2 md:line-clamp-1 md:w-5/6 " >{item.description}</p>

            <div className="flex justify-between gap-1 text-xs md:text-sm text-purple-800 font-semibold">
              <div>
                {item.positionsAvailable}/{item.totalPositions} Positions Available
              </div>
              {over == false ? <div>
                {item.applicationsSubmitted}{item.totalApplications == 0 ? "" : `${"/" + item.totalApplications}`} Applications submitted
              </div> : 
              <>
              <div className="text-red-600 md:hidden inline-flex items-center gap-2"><CircleX color="red" size={20} />Closed</div>
              <div className="text-red-600 hidden md:inline-flex gap-2"><CircleX color="red" size={20} />Applications Closed</div>
              </>
              }
            </div>

          </div>
        </div>
      </DialogTrigger>
      {!submitted && !over && <DialogContent className="md:min-w-[800px] h-full md:h-max">
        <ScrollArea className="h-full">
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
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} type="text" required placeholder="Name " />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email " />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(Number(e.target.value))} type="number" required placeholder="Phone " />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="about yourself">About yourself</Label>
                    <Textarea id="about yourself" value={text} onChange={(e) => setText(e.target.value)} required placeholder="about yourself " />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="resume">Attach Resume</Label>
                    <Input id="resume" type="file" onChange={handleFileChange} accept="application/pdf" required placeholder="Resume" />
                  </div>
                  {progress > 0 && <Progress value={progress} className="" />}
                  <div className="flex justify-between ">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary" className="mr-auto">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={progress > 0} type="submit" className="bg-purple-700 text-white w-full ml-2 " >Submit</Button>

                  </div>
                </div>

              </form>
            </div>
          </div>
        </ScrollArea>

      </DialogContent>
      }
    </Dialog>
  )
}
