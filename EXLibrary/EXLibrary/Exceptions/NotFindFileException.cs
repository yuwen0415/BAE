using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Exceptions
{
    public class NotFindFileException : ApplicationException
    {
        public NotFindFileException()
        {
        }
        public NotFindFileException(string message)
            : base(message)
        {
        }

        public NotFindFileException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
