import { FC } from "react"

const Footer: FC = () => {
  return (
    <footer className="my-auto mx-auto">
      <p className="text-sm">© {new Date().getFullYear()} b2bLead.</p>
    </footer>
  )
}

export default Footer
