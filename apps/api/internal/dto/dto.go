package dto

type PlanRequest struct {
	Body struct {
		Goal string `json:"goal" doc:"The goal to plan for"`
	}
}

type PlanResponse struct {
	Body struct {
		Steps []string `json:"steps" doc:"List of planned steps"`
	}
}

type AnalyzeRequest struct {
	Body struct {
		Text string `json:"text" doc:"The idea to analyze"`
	}
}

type AnalyzeResponse struct {
	Body struct {
		Summary string   `json:"summary"`
		Score   int      `json:"score"`
		Tags    []string `json:"tags"`
	}
}

type RunRequest struct {
	ID string `path:"id" doc:"Run ID"`
}

type RunResponse struct {
	Body struct {
		ID         string `json:"id"`
		Status     string `json:"status"`
		ResultJSON string `json:"result_json"`
		CreatedAt  string `json:"created_at"`
	}
}
