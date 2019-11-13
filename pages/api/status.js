import { refreshInfo } from '../../components/system'

export default async (req, res) => {
  const info = await refreshInfo()
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = 200
  res.end(JSON.stringify(info))
}