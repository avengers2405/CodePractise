package main

import (
	"flag" // this library is used to take flag values from cmd while running the file. it used to take port arg below, default being 5000
	"fmt"
	"net/http"
	"time"

	"github.com/avengers2405/CodePractise/backend/app"
	"github.com/avengers2405/CodePractise/backend/routes"
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

	// http.HandleFunc("/health", HealthCheck)
	r := routes.SetupRoutes(app)
	server := &http.Server{
		// Addr: ":5000",
		Addr:         fmt.Sprintf(":%d", port),
		Handler:      r,
		IdleTimeout:  5 * time.Second,
		ReadTimeout:  time.Minute,
		WriteTimeout: 15 * time.Second,
	}

	err = server.ListenAndServe()
	if err != nil {
		app.Logger.Fatal(err)
	}
}
