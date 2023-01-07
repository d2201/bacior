import { assertUser } from '../../../assertions'
import { ControllerFunction } from '../../../types'
import * as services from '../services'

export const listAvailableSpreadsheets: ControllerFunction = async (
  req,
  res
) => {
  assertUser(req.user)

  const data = await services.listAvailableSpreadsheets()

  res.send(`<html>
<body>
  <ul>
    ${
      data.files
        ?.map(
          (file) =>
            `<li>${file.name} 
              <form method="post" action="/spreadsheets/select">
                <input type="hidden" name="sheetId" value="${file.id}"/>
                <button type="submit">Wybierz</button>
              </form>
            </li>`
        )
        .join('') ?? ''
    }
  </ul>
</body>
</html>`)
}
