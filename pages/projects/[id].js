import projects from "../../data/projects.json";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function ProjectTitle() {
  // Get window width
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  // Setup Router
  const router = useRouter();
  let { id } = router.query
  id = parseInt(id)

  // Get project data
  const project = projects[id]
  console.log(id)
  console.log(project)

  // Setup Image Width based on image size
  let imageWidth
  let imageHeight
  if (id === 0) {
    imageWidth = windowWidth * 0.7
    imageHeight = windowWidth * 0.38
  } else if (id === 1) {
    imageWidth = windowWidth * 0.7
    imageHeight = windowWidth * 0.45 
  } else {
    imageWidth = windowWidth * 0.7
    imageHeight = windowWidth * 0.5
  }

  // Show loafing screen if project data is not loaded
  if (!project) {
    return (
      <div className="flex items-center justify-center h-full text-center bg-red-300">
        <h1>Loading...</h1>
      </div>
    )
  }
  return (
    <div className={"flex-col w-full pt-8 pb-24 overflow-y-scroll" + ` h-[${imageHeight*1.5}px]`}>
      <h1 className="m-8 text-3xl font-bold text-center center font-ox">
        {project.title}
      </h1>
      <div className="flex items-center justify-center my-4">
        <Image
          src={`${project.imageURI}`}
          width={imageWidth}
          height={imageHeight}
          className="rounded"
        />
      </div>
      <div className="flex items-center justify-center my-4">
        <p className="text-sm text-left w-1/2">{project.description}</p>
        <button className="h-12 px-8 m-4 font-semibold text-white rounded nm-convex-red-500-sm font-ox" onClick={() => 
          project.link ? window.open(project.link) : null
        }>
          View Live
        </button>
      </div>
    </div>
  );
}
