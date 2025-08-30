package app

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/avengers2405/CodePractise/backend/api"
)

type Application struct {
	Logger            *log.Logger
	CredentialHandler *api.CredentialHandler
	SubmissionHandler *api.SubmissionHandler
	ProblemHandler    *api.ProblemHandler
}

func NewApplication() (*Application, error) {
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	app := &Application{
		Logger:            logger,
		CredentialHandler: api.NewCredentialHandler(),
		SubmissionHandler: api.NewSubmissionHandler(),
		ProblemHandler:    api.NewProblemHandler(),
	}

	return app, nil
}

func (a *Application) HealthCheck(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Server is running yoohooo\n")
}
