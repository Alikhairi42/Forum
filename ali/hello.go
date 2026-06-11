package main
import (
	"net/http"
	"fmt"
	"github.com/gin-gonic/gin"
)

type task struct {
	ID int `json:"id"`
	Name string `json:"name"`
}

var tasks = []task{
	{ID: 1, Name: "Task 1"},
	{ID: 2, Name: "Task 2"},
}

func main() {
	router := gin.Default()

	router.GET("/tasks", func(c *gin.Context) {
		c.JSON(http.StatusOK, tasks)
	})

	router.POST("/tasks", func(c *gin.Context) {
		var newTask task
		if err := c.BindJSON(&newTask); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		newTask.ID = len(tasks) + 1
		tasks = append(tasks, newTask)
		c.JSON(http.StatusCreated, newTask)
	})

	fmt.Println("Server is running on http://localhost:8080")
	router.Run(":8080")
}