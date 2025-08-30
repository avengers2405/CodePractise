package routes

import (
	"github.com/avengers2405/CodePractise/backend/app"
	"github.com/go-chi/chi/v5"
)

func SetupRoutes(app *app.Application) *chi.Mux {
	r := chi.NewRouter()

	r.Get("/health", app.HealthCheck)
	r.Get("/credential/get", app.CredentialHandler.GetCredentials)
	r.Get("/credentials/set", app.CredentialHandler.SetCredentials)
	r.Get("/submit", app.SubmissionHandler.SubmitSolution)
	r.Get("/submission", app.SubmissionHandler.CheckSolutionStatus)
	r.Get("/problem/statement/{id}", app.ProblemHandler.GetProblemStatement)
	r.Get("/problem/template/{id}", app.ProblemHandler.GetCodeTemplate)
	return r
}
