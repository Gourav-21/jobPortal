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
import { Lock } from "lucide-react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"



export default function Login({ setAdmin }: { setAdmin: (arg0: boolean) => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const q = query(collection(db, "admins"), where("username", "==", email));

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const adminData = querySnapshot.docs[0].data();
      if (email === adminData?.username && password === adminData?.password) {
        setAdmin(true)
      } else {
        alert("Ugyldige legitimasjon")
      }
    } else {
      alert("Ugyldige legitimasjon")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className=" inline-flex gap-2" >Legg til jobb<Lock size={20} /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex items-center justify-between">
            <img src="https://instacallas.no/wp-content/uploads/2024/03/cropped-cropped-instacall-logo-1.png" alt="instacall" className="object-scale-down h-12 w-12" />

          <DialogTitle> Admin pålogging </DialogTitle>
          <DialogDescription>
          Hei! Er du arbeidsgiver, administrator eller en del av Instacall-teamet som ønsker å legge ut stillinger for andre å søke på? Oppgi admin-informasjonen din, så kan du gjøre det
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={login}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email">Brukernavn</Label>
              <Input className="col-span-3" id="email" type="text" onChange={e => setEmail(e.target.value)} value={email} placeholder="m@example.com" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password">Passord</Label>
              <Input className="col-span-3" id="password" onChange={e => setPassword(e.target.value)} value={password} type="password" required />
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full">Logg inn</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

