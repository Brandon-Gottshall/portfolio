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

  // Get project title
  let projectTitle = router.query.projectTitle;

  // Replace %20 with spaces
  // projectTitle = projectTitle.replace(/%20/g, ' ')
  console.log(projectTitle);
  console.log(projects.filter((project) => project.title === projectTitle));

  // Get project data
  const project = projects.filter(
    (project) => project.title === projectTitle
  )[0];

    
  // Setup Image Width based on image size
  let imageWidth
  let imageHeight
  if (project.title === "My Portfolio") {
    imageWidth = windowWidth * 0.7
    imageHeight = windowWidth * 0.35
  } else if (project.title === "Crime NY") {
    imageWidth = windowWidth * 0.7
    imageHeight = windowWidth * 0.45 
  } else {
    imageWidth = windowWidth * 0.7
    imageHeight = windowWidth * 0.5
  }

  return (
    <div className="flex-col items-center justify-center w-full pt-8 overflow-y-scroll">
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
