import { Job } from "@/App"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function Post2({ item }: { item: Job }) {
  const [email, setEmail] = useState("")
  return (
    <Dialog >
      <DialogTrigger className="text-left hover:bg-muted mb-3 p-2 rounded-md w-full ">
        <div className="grid grid-cols-7 gap-3 w-full ">
          <div className="col-span-1 flex justify-center items-center  bg-purple-700">
            <Building2 color="white" size={30} />
            {/* <Avatar>
              <AvatarImage src="" />
              <AvatarFallback></AvatarFallback>
            </Avatar> */}
          </div>
          <div className="col-span-6 grid gap-2 relative">
            <h1 className="text-xl font-semibold text-purple-700 " >{item.title.length > 50 ? item.title.substring(0, 50) + "..." : item.title}</h1>
            <p className="text-sm text-gray-600" >{item.description.substring(0, 70) + "..."}</p>

            <div className="flex justify-between text-sm text-purple-800">
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
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">emamil to send</Label>
              <Input id="email" type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Name " />
            </div>
            <form action={`https://formsubmit.co/${email}`} method="POST" encType="multipart/form-data">
              <div className="grid w-full items-center gap-4">
                <input type="hidden" name="_captcha" value="false" />
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" type="text" placeholder="Name " />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="Email " />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="number" placeholder="Phone " />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="resume">Attach Resume</Label>
                  <Input id="resume" name="resume" type="file" accept="application/pdf" placeholder="Resume " required />
                </div>


              </div>
              <Button className="bg-purple-700 text-white w-full" >Submit</Button>
            </form>

          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
