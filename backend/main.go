package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/avengers2405/CodePractise/backend/app"
)

func main(){
	app, err := app.NewApplication()
	if err != nil {
		panic(err)
	}

	app.Logger.Println("we are running from the app");

	http.HandleFunc("/health", HealthCheck)
	server := &http.Server{
		Addr: ":5000",
		IdleTimeout: 5*time.Second,
		ReadTimeout: time.Minute,
		WriteTimeout: 15*time.Second,
	}

	err = server.ListenAndServe()
	if err != nil {
		app.Logger.Fatal(err)
	}
}

func HealthCheck(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Server is running yoohooo\n")
}
