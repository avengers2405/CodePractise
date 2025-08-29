package main

import (
	"flag" // this library is used to take flag values from cmd while running the file. it used to take port arg below, default being 5000
	"fmt"
	"net/http"
	"time"

	"github.com/avengers2405/CodePractise/backend/app"
)

func main() {

	var port int
	flag.IntVar(&port, "port", 5000, "port which server listens to")
	flag.Parse()

	app, err := app.NewApplication()
	if err != nil {
		panic(err)
	}

	app.Logger.Println("we are running from the app")

	http.HandleFunc("/health", HealthCheck)
	server := &http.Server{
		// Addr: ":5000",
		Addr:         fmt.Sprintf(":%d", port),
		IdleTimeout:  5 * time.Second,
		ReadTimeout:  time.Minute,
		WriteTimeout: 15 * time.Second,
	}

	err = server.ListenAndServe()
	if err != nil {
		app.Logger.Fatal(err)
	}
}

func HealthCheck(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Server is running yoohooo\n")
}
