import Image from "next/image";

export default function Home() {
  return (
    <>
      <h1>Проект - Info21 v2.0 Web</h1>
      <p>Создание web-интерфейса для проекта SQL2 на языке Python.</p>
      <p>Разработано web-приложение с использование MVC-фреймворка, 100%
        Server-Side Rendering.</p>
      <p>Приложение поддерживает:
        <ul>
          <li>осуществление CRUD-операций</li>
          <li>импорт/экспорт таблиц</li>
          <li>осуществление разработанных операций/функций через графический
            интерфейс
          </li>
          <li>логирование действий пользователя</li>
        </ul>
      </p>
      <h2>Team</h2>
      <p>pintoved@student.21-school.ru</p>
      <p>someoneelse@student.21-school.ru</p>
    </>
  );
}
