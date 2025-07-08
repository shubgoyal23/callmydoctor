import { Button } from "./components/ui/button"
import { useState } from "react"


function App() {
  const [count, setCount] = useState(0)

  return (
    <Button onClick={() => setCount(count + 1)}>Count: {count}</Button>
  )
}

export default App
