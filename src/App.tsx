import { collection,  query, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from 'react'
import Login from "./components/Login"
import AddJob from "./components/AddJob"
import { Trash2 } from "lucide-react"
import EditJob from "./components/EditJob"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "./components/ui/separator"
import { db } from "./lib/firebase";
import { toast } from "./components/ui/use-toast";
import Post from "./components/Post";


export interface Job {
  id: string;
  title: string;
  description: string;
  positionsAvailable: number;
  totalPositions: number;
  surveysSubmitted: number;
  totalSurveys: number;
  logo:string,
  company:string,
  phone:number | undefined,
  to_email:string
  location:string
}

export default function App() {
  const [data, setData] = useState<Job[]>([]);

  const [admin, setAdmin] = useState(true)

  async function deleteJob(id: string) {
    try {
      await deleteDoc(doc(db, "posts", id));
      setData((prevData) => prevData.filter((job) => job.id !== id));
      toast({
        title: "Job deleted successfully.",
        description: "The job has been deleted from the database.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    }
  }

  useEffect(() => {
    read()
  }, [])



  async function read() {
    try {
      const q = query(collection(db, "posts"))
      const querySnapshot = await getDocs(q);
      const posts: Job[] = [];
      querySnapshot.forEach((doc) => {
        // @ts-ignore
        posts.push({ id: doc.id, ...doc.data() });
      });
      setData(posts);
      console.log(posts);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    }
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

          <div className="overflow-auto flex flex-col justify-items-stretch gap-3" >
            {data.map((item) => {
              return (
                <div className="relative" key={`${item.id}`}>

                  {admin && <div className="flex gap-2 absolute top-4 right-4 z-50">
                    <EditJob item={item} setData={setData} />
                    <Trash2 onClick={() => deleteJob(item.id)} className="hover:text-red-700 h-5 w-5" />
                  </div>}

                  <Post item={item} />
                  <Separator className="" />
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>

    </div>
  )
}
