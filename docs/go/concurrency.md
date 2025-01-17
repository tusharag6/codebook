---
sidebar_position: 4
---

# Concurrency in Go

## **Goroutines**

### Key Points:
- A **goroutine** is a lightweight thread managed by the Go runtime.
- Use the `go` keyword to create a goroutine:
```go
go sayHello()
```

### Features:
- **Green Threads**: Goroutines are an abstraction over OS threads, making them:
  - Lightweight (consume minimal stack space, starting at ~2 KB).
  - Cheap to create and destroy.
- **Go Runtime Scheduler**: Maps goroutines to OS threads and manages execution periodically.

### Example:
```go
func sayHello() {
    fmt.Println("Hello from goroutine!")
}

func main() {
    go sayHello()
}
```
#### Why might this print nothing?
- The main goroutine (where `main()` runs) exits before the other goroutines complete.
- When the main goroutine exits, the program terminates, destroying all other goroutines.

#### How to Fix:
1. **`time.Sleep()`**:
   - Temporary and discouraged.
2. **`sync.WaitGroup`** (Preferred):
   - Synchronizes goroutines, ensuring they complete before the main goroutine exits.

### **WaitGroups**
```go
var wg sync.WaitGroup

func sayHello() {
    defer wg.Done() // Notify completion
    fmt.Println("Hello from goroutine!")
}

func main() {
    wg.Add(1)       // Add goroutine to the wait group
    go sayHello()
    wg.Wait()       // Wait for all goroutines to finish
}
```

### **Mutexes**
- Use `sync.Mutex` to protect shared resources and prevent **race conditions**:
```go
var mu sync.Mutex
var counter int

func increment() {
    mu.Lock()
    counter++
    mu.Unlock()
}

func main() {
    for i := 0; i < 10; i++ {
        go increment()
    }
}
```
#### When to Use:
- When multiple goroutines access and modify shared variables concurrently.

## **Channels**

### Key Points:
- Channels provide a way for goroutines to communicate by passing data between them.
- **Declaration**:
```go
ch := make(chan int) // Unbuffered channel
```
- **Operations**:
  - **Send**:
    ```go
    ch <- 42
    ```
  - **Receive**:
    ```go
    value := <-ch
    ```

### **Unbuffered Channels**
- Default behavior: Can hold one value at a time.
- Sending blocks the sender until the receiver retrieves the value.

### **Buffered Channels**
- Can store multiple values:
```go
ch := make(chan int, 10) // Buffer size of 10
```
- Useful when sender and receiver operate at different rates.

### **Directional Channels**
- Restrict channels to **send-only** or **receive-only**:
```go
// Receiving data
go func(ch <-chan int) {
    value := <-ch
    fmt.Println(value)
}(ch)

// Sending data
go func(ch chan<- int) {
    ch <- 42
}(ch)
```

### **Looping Over Channels**
- Use `for..range` to iterate over channels:
```go
for value := range ch {
    fmt.Println(value)
}
```

#### Deadlock Alert:
- If the channel remains open with no new values, the loop blocks indefinitely.
- Fix: Close the channel when done:
```go
close(ch)
```

### **Signal-Only Channels**
- Use a `chan struct{}` for signaling purposes:
```go
done := make(chan struct{})

go func() {
    // Do some work
    done <- struct{}{}
}()

<-done // Wait for signal
```
#### Why `struct{}` over `bool`?
- `struct{}` takes zero memory, whereas `bool` requires allocation.

## **Select**
- The `select` statement waits on multiple channel operations and executes the first one ready:
```go
select {
case msg := <-ch1:
    fmt.Println("Received from ch1:", msg)
case ch2 <- 42:
    fmt.Println("Sent to ch2")
default:
    fmt.Println("No channel is ready")
}
```

### Features:
- Blocks until one case is ready.
- If multiple cases are ready, one is chosen at random.