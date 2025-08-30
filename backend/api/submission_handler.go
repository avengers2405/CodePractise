package api

import (
	"fmt"
	"net/http"
)

type SubmissionHandler struct{}

func NewSubmissionHandler() *SubmissionHandler {
	return &SubmissionHandler{}
}

func (*SubmissionHandler) SubmitSolution(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Submit solution function is called")
}

func (*SubmissionHandler) CheckSolutionStatus(w http.ResponseWriter, r *http.Request) {
	fmt.Println("You will get a JSON response of what is verdict for the solution")
}
