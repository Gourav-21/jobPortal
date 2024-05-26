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
import {  doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"



export default function EditJob({ item, setData }: { item: Job, setData: React.Dispatch<React.SetStateAction<Job[]>> }) {
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
      title,description,totalPositions,totalSurveys,positionsAvailable,surveysSubmitted:item?.surveysSubmitted
    });
    setData((prevData) => prevData.map((job) => job.id === item.id ? { ...job, title, description,positionsAvailable, totalPositions, totalSurveys } : job));
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
