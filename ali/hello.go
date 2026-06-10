package main

import (
	"ali/get"
	"log"
)

func main(){
	greeting, err := get.Hello("aaaa")
	if err != nil {
		log.Fatalf("Error: %v", err)
	}
	log.Println(greeting)
}