import Image from "next/image";

export default function Home() {
  return (
    <div className="container">
      <h1 className="mt-5">Project - Info21 v2.0 Web</h1>
      <p className="mt-3">Creating a web interface for the SQL2 project using Python.</p>
      <p className="mt-3">Developed a web application using an MVC framework, with 100% Server-Side Rendering.</p>
      <p className="mt-3">The application supports:</p>

      <ul>
        <li>Performing CRUD operations</li>
        <li>Importing/exporting tables</li>
        <li>Executing custom operations/functions through the graphical interface </li>
        <li>User action logging</li>
      </ul>

      <h2 className="mt-5">Team</h2>
      <p className="mt-2">
        pintoved@student.21-school.ru <br />
        someone@student.21-school.ru
      </p>
    </div>
  );
}
