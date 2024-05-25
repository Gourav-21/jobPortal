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



export default function Login({ setAdmin }: { setAdmin: (arg0: boolean) => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function login(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (email === "admin" && password === "admin") {
      setAdmin(true)
    } else {
      alert("Invalid credentials")
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className=" inline-flex gap-2" >Add job <Lock size={20} /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> Admin Login </DialogTitle>
          <DialogDescription>
          Enter your email below to login to your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={login}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email">Username</Label>
          <Input className="col-span-3" id="email" type="text" onChange={e => setEmail(e.target.value)} value={email} placeholder="m@example.com" required />
       </div>
          <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password">Password</Label>
          <Input className="col-span-3" id="password" onChange={e => setPassword(e.target.value)} value={password} type="password" required />
        </div>
        </div>
        <DialogFooter>
        <Button className="w-full">Sign in</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

