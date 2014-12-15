using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Exceptions
{
    public class NotFindWindowsServiceException : ApplicationException
    {
        public NotFindWindowsServiceException()
        {
        }
        public NotFindWindowsServiceException(string message)
            : base(message)
        {
        }

        public NotFindWindowsServiceException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
