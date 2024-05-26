import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import { useState } from 'react'
import Login from "./components/Login"
import Post from "./components/Post"
import AddJob from "./components/AddJob"
import { FilePenLine, Trash2 } from "lucide-react"
import EditJob from "./components/EditJob"
import { ScrollArea } from "@/components/ui/scroll-area"
import Post2 from "./components/Post2"


export interface Job {
  id: number;
  title: string;
  description: string;
  positionsAvailable: number;
  totalPositions: number;
  surveysSubmitted: number;
  totalSurveys: number;
}

export default function App1() {
  const [data, setData] = useState<Job[]>([
    {
      id: 1,
      title: "Kebab maker",
      description: "Become a kebab seller here, please apply we need youegwegegegg..",
      positionsAvailable: 14,
      totalPositions: 20,
      surveysSubmitted: 20,
      totalSurveys: 50
    },
    {
      id: 2,
      title: "Pizza Chef",
      description: "Join our team as a pizza chef, apply now we need pizzalovers..",
      positionsAvailable: 5,
      totalPositions: 20,
      surveysSubmitted: 15,
      totalSurveys: 50
    },
    // ... add other job posts with unique ids
    {
      id: 15,
      title: "Pastry Chef",
      description: "Join our team as a pastry chef, apply now we need dessertlovers..",
      positionsAvailable: 6,
      totalPositions: 40,
      surveysSubmitted: 50,
      totalSurveys: 50
    }
  ]);

  const [admin, setAdmin] = useState(false)

  function deleteJob(id: number) {
    setData((prevData) => prevData.filter((job) => job.id !== id));
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-1/2 h-1/2">

      <div className=" mb-2">

      {!admin && <Login setAdmin={setAdmin} />}
      {admin && <AddJob setData={setData} />}
      </div>
      <ScrollArea className=" rounded-md border p-4 h-[400px]">
        {data.length === 0 && <div className="text-center m-5" >No jobs found</div>}
        
      <div  className="overflow-auto flex flex-col justify-items-stretch gap-3" >
        {data.map((item, index) => {
          return (
            <div className="relative " key={`${index}`}>

              {admin && <div className="flex gap-2 absolute top-4 right-4 z-50">
                <EditJob item={item} setData={setData} />
                <Trash2 onClick={() => deleteJob(item.id)} className="hover:text-red-700 h-5 w-5" />
              </div>}

              <Post2 item={item} />
            </div>
          )
        })}
      </div>
        </ScrollArea>
      </div>

    </div>
  )
}
