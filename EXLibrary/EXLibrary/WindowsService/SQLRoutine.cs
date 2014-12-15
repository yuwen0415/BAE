using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.WindowsService
{
    public class SQLRoutine
    {
        #region 事务
        public void BeginTransaction(System.Data.Linq.DataContext _dataContext)
        {
            if (_dataContext.Connection.State != System.Data.ConnectionState.Open)
            {
                _dataContext.Connection.Open();
            }
            _dataContext.Transaction = _dataContext.Connection.BeginTransaction();

        }

        public void CommitTransaction(System.Data.Linq.DataContext _dataContext)
        {
            _dataContext.Transaction.Commit();
        }

        public void RollbackTransaction(System.Data.Linq.DataContext _dataContext)
        {
            _dataContext.Transaction.Rollback();
        }

        public void EndTransaction(System.Data.Linq.DataContext _dataContext)
        {
            _dataContext.Transaction.Dispose();
            _dataContext.Transaction = null;
        }
        #endregion
    }
}
