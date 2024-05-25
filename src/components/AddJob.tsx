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
import { LockOpen } from "lucide-react"
import { Textarea } from "./ui/textarea"



export default function AddJob({ setData }: { setData: React.Dispatch<React.SetStateAction<Job[]>> }) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalPositions, setTotalPositions] = useState(0);
  const [totalSurveys, setTotalSurveys] = useState(0);

  function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setData((prevData) => [
      { title, description, totalPositions, totalSurveys, id: prevData.length + 1,positionsAvailable:totalPositions, surveysSubmitted:0 },
      ...prevData, 
    ]);
    // Clear the form after adding
    
    setTitle("");
    setDescription("");
    setTotalPositions(0);
    setTotalSurveys(0);

    toast({
      title: "Job added successfully!",
      description: "Your job has been added to the job list.",
    })
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="outline" className="inline-flex items-center gap-2">Add job <LockOpen size={20} /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> Add New Job Post </DialogTitle>
          <DialogDescription>
            Enter your job details below to add to the job list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={add} className="grid gap-4 py-4">
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
          <DialogFooter>
            <Button type="submit" className="w-full">Add Job</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
