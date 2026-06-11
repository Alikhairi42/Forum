package main

import (
    "fmt"
    "example.com/mymath" // Hna kan-importiw l-lib dyalna
)

func main() {
    result := mymath.Add(10, 5)
    fmt.Println("L-natija hiya:", result)
}