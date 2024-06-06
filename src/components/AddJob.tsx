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
import { Building2, Check, LockOpen, X } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { addDoc, collection } from "firebase/firestore"
import { db, storage } from "@/lib/firebase"
import { Job } from "@/App"
import { ref,  getDownloadURL, uploadBytes } from "firebase/storage";
import { Progress } from "./ui/progress"
import { ScrollArea } from "./ui/scroll-area"
import { v4 } from "uuid"

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
  const [totalApplications, setTotalApplications] = useState(0);

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
      console.log(logo)

      const docRef = await addDoc(collection(db, "posts"), {
        title, description, totalPositions, totalApplications, positionsAvailable: totalPositions, applicationsSubmitted: 0, logo: uploadedLogo, company, phone, to_email: email, location
      });

      setData((prevData) => [
        { title, logo: uploadedLogo, description, totalPositions, totalApplications, id: docRef.id, positionsAvailable: totalPositions, applicationsSubmitted: 0, company, phone, to_email: email, location },
        ...prevData,
      ]);

      setTitle("");
      setDescription("");
      setTotalPositions(0);
      setTotalApplications(0);
      setFile(null);
      setLogo("");
      setProgress(0);
      setCompany("");
      setPhone(undefined);
      setEmail("");


      toast({
        title: "Jobben ble lagt til!",
        description: "Jobben din er lagt til jobblisten.",
      })
      setOpen(false);
    } catch (error) {
      console.error("Error getting posts:", error);

      toast({
        variant: "destructive",
        title: "UH oh! Noe gikk galt.",
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
      return logo;
    }
    setProgress(10);

    const storageRef = ref(storage, `logo/${file?.name + v4()}`);
    await uploadBytes(storageRef, file);
    setProgress(50);


    return await getDownloadURL(storageRef);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="outline" className="inline-flex items-center gap-2">Legg til jobb <LockOpen size={20} /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px] h-full sm:h-max ">
      <ScrollArea className="h-full">

        <DialogHeader>
          <DialogTitle> Legg til ny stilling </DialogTitle>
          <DialogDescription>
          Skriv inn jobbdetaljene dine nedenfor for å legge til jobblisten.
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
                  ) : <Building2 color="white" size={30} />}
                </div>
                <div className="col-span-3 grid gap-2" >
                  <Label htmlFor="logo">Logo</Label>
                  <div className="flex gap-2">

                    <Input id="logo" className="col-span-3" type="file" onChange={handleFileChange} accept="image/png, image/jpeg" placeholder="logo " />
                    {file && <Button type="button" onClick={() => setFile(null)}>Fjerne</Button>}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company">Selskap</Label>
                <Input
                  className="col-span-3"
                  id="company"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="Selskap"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location">plassering</Label>
                <Input
                  className="col-span-3"
                  id="location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="plassering"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone">telefon</Label>
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
                <Label htmlFor="title">Tittel</Label>
                <Input
                  className="col-span-3"
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Jobbtittel"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description">Beskrivelse</Label>
                <Textarea
                  className="col-span-3"
                  id="description"
                  rows={6}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="stillingsbeskrivelsen kommer her"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="totalPositions">Stillinger tilgjengelig</Label>
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
                <Label htmlFor="totalApplications">Totalt antall søknader</Label>
                <div className="flex gap-2 w-full col-span-3">

                  <Input
                    className=""
                    type="number"
                    id="totalApplications"
                    value={totalApplications}
                    onChange={(e) => setTotalApplications(Number(e.target.value))}
                    required
                  />
                  <Button type="button" className="inline-flex gap-2" variant={"secondary"} onClick={() => setTotalApplications(0)}>{totalApplications ==0 ? <Check color="green" size={20} />:<X color="red" size={20} />}Ingen grense</Button>
                </div>
              </div>
            </div>

          </div>

          <Progress value={progress} className="" />
          <DialogFooter>
            <Button type="submit" disabled={progress > 0} className="w-full">Legg til jobb</Button>
          </DialogFooter>
        </form>
      </ScrollArea>

      </DialogContent>
    </Dialog>
  )
}
