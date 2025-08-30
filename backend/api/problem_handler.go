package api

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type ProblemHandler struct{}

func NewProblemHandler() *ProblemHandler {
	return &ProblemHandler{}
}

func (*ProblemHandler) GetProblemStatement(w http.ResponseWriter, r *http.Request) {
	problemId := chi.URLParam(r, "id")
	if problemId == "" {
		http.NotFound(w, r)
		return
	}

	fmt.Printf("getting problem statement in form of json for id: %s\n", problemId)
}

func (*ProblemHandler) GetCodeTemplate(w http.ResponseWriter, r *http.Request) {
	fmt.Println("code template for a given problem statement would be provided here")
}
