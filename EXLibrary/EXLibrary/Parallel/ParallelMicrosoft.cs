using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace EXLibrary.Parallel
{
    public class ParallelMicrosoft : IParallel
    {
        private CancellationTokenSource CancellationTokenSource
        {
            get
            {
                var cts = new CancellationTokenSource();
                cts.Token.Register(() =>
                {
                    if (StopParallelTask != null)
                        StopParallelTask();
                });
                return cts;
            }
        }

        public event EventHandler.StopParallelTaskEventHandler StopParallelTask;

        public void Start<T>(ICollection<T> collection, Action<T> action)
        {

            System.Threading.Tasks.Parallel.ForEach<T>(collection, new ParallelOptions() { CancellationToken = CancellationTokenSource.Token }, action);
        }

        public void Start<T>(IEnumerable<T> collection, Action<T> action)
        {
            System.Threading.Tasks.Parallel.ForEach<T>(collection, new ParallelOptions() { CancellationToken = CancellationTokenSource.Token }, action);
        }

        public void Stop()
        {
            CancellationTokenSource.Cancel(false);
        }

    }
}
