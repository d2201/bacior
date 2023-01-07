import { createDebugger } from "."

type Job = {
  id: string
  handler: () => Promise<void>
  retries?: number
}

type WithDebug<T> = T & { debug: ReturnType<typeof createDebugger> }

export class JobQueue {
  private readonly MAX_RETRIES = 5
  private readonly _queue: WithDebug<Job>[] = []
  private readonly debug = createDebugger('queue')

  enqueue(job: Job) {
    if (this._queue.some((q) => q.id === job.id)) {
      this.debug(`[id: ${job.id}] Job already enqueued`)
      return
    }

    this.debug(`[id: ${job.id}] New job enqueued`)
    this._queue.push({ ...job, debug: createDebugger(`queue:job:${job.id}`) })
  }

  async process() {
    const job = this._queue.shift()

    if (!job || (job.retries ?? 0) >= this.MAX_RETRIES) {
      return
    }

    try {
      job.debug(`Processing job`)
      await job.handler()
      job.debug(`Job processed`)
    } catch (error) {
      console.error('Error processing job: ', error)
      job.debug(`Enqueuing job again`)
      this.enqueue({ ...job, retries: (job.retries ?? 0) + 1 })
    }
  }

  setupProcessor(interval: number) {
    setTimeout(() => {
      this.process().then(() => this.setupProcessor(interval))
    }, interval)
  }
}

const queue = new JobQueue()

export default queue
