using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Algorithm
{
    public class ARMAAlgorithm : IAlgorithm
    {
        private Dictionary<string, object> _Parameters
        {
            get;
            set;
        }

        /// <summary>
        /// 两个参数：1、“HistoryData”（double[，]），历史数据；2、“Step”（int），步长。
        /// </summary>
        public Dictionary<string, object> Parameters
        {
            get
            {
                if (_Parameters == null)
                {
                    _Parameters = new Dictionary<string, object>();
                }
                return _Parameters;
            }
            set
            {
                _Parameters = value;
            }
        }

        public double[] GetResult()
        {
            try
            {
                return Caculator((double[,])Parameters["HistoryData"], (int)Parameters["Step"])[0];
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        #region 内部函数

        private Matrix Caculator(double[,] x, int k)
        {
            var y = new Matrix(x);
            this.History = y;
            this.fun_Parameter(this.fun_Gamma(y), 3, 2);
            var _return = this.CaculateARMA(k);
            return _return;
        }

        #region 内部实现算法

        private Matrix fun_Gamma(Matrix y)
        {
            double m = (double)(y.Col / 4);
            Matrix _result = new Matrix(1, y.Col / 4);
            double sum = 0.0;
            double average = 0.0;
            for (var a = 0; a < y.Col; a++)
            {
                average += y[0, a];
            }
            average = (double)(average / y.Col);
            for (var i = 0; i < m; i++)
            {
                for (var j = 0; j < y.Col - i; j++)
                {
                    sum += (y[0, j] - average) * (y[0, j + i] - average);
                }
                _result[0, i] = (double)(sum / y.Col);
            }

            return _result;
        }

        private void fun_Parameter(Matrix gamma, int p, int q)
        {
            if (p == 0 || q == 0)
            {
                return;
            }
            Matrix phi;
            var gammay = new Matrix(1, q);
            var A = new Matrix(p);
            for (var i = 0; i < p; i++)
            {
                for (var j = 0; j < p; j++)
                {
                    var t = 0;
                    if (q + 1 + i - j <= 0)
                    {
                        t = 2 - (q + 1 + i - j);
                    }
                    else { t = q + 1 + i - j; }
                    A.SetValue(i, j, gamma.GetValue(0, t));
                }
            }
            double[,] tem = new double[1, p];
            for (var n = q + 1; n < p + q + 1; n++)
            {

                tem[0, n - q - 1] = gamma.GetValue(0, n);
            }
            var b = new Matrix(tem).Transpose();
            phi = (A.Inverse() * b).Transpose();

            this.Phi = phi;

            var phi_t = new Matrix(phi.Row, phi.Col + 1);
            phi_t[0, 0] = -1;
            for (var c = 0; c < phi.Col; c++)
            {
                phi_t[0, c + 1] = phi[0, c];
            }
            for (var k = 0; k < q; k++)
            {
                double sum = 0;
                for (var j = 0; j < p + 1; j++)
                {
                    for (var l = 0; l < p + 1; l++)
                    {
                        var t = 0;
                        if (k + l - j + 1 <= 0)
                        {
                            t = 2 - (k + l - j + 1);
                        }
                        else
                        {
                            t = k + l - j + 1;
                        }
                        sum = sum + phi_t[0, j] * phi_t[0, l] * gamma[0, t];
                    }
                }
                gammay[0, k] = sum;
            }
            var x1 = new Matrix(1, q + 1);
            for (var a = 0; a < q; a++)
            {
                x1[0, a] = 0;
            }
            x1[0, q] = gammay[0, 0];
            var x2 = new Matrix(1, q + 1);
            double maxerr = 10;
            while (maxerr > 0.0005)
            {
                double sum = 0;

                for (var i = 0; i < q; i++)
                {
                    sum = sum + x1[0, i] * x1[0, i];
                }
                x2[0, q] = gammay[0, 0] / (1 + sum);
                for (var k = 0; k < q; k++)
                {
                    sum = 0;
                    for (var i = 0; i < q - k; i++)
                    {
                        sum = sum + x1[0, k + i] * x1[0, i];
                    }
                    x2[0, k] = -(gammay[0, k] / x1[0, q] - sum);
                }

                var max = x1 - x2;
                for (var num = 0; num < q; num++)
                {
                    maxerr = 0;
                    if (Math.Abs(max[0, num]) > maxerr)
                    {
                        maxerr = Math.Abs(max[0, num]);
                    }
                }
                x1 = x2;
            }
            this.Theta = new Matrix(x2.Row, x2.Col - 1);
            for (var col = 0; col < x2.Col - 1; col++)
            {
                this.Theta[0, col] = x2[0, col];
            }
            //sigma=x2[0,q];
        }

        private Matrix CaculateARMA(int k)
        {
            var N = this.History.Col;
            var p = this.Phi.Col;
            var q = this.Theta.Col;
            var s = 10;
            var pi = new Matrix(1, s);
            var yhat = new Matrix(1, N + k);
            var y1 = new Matrix(1, N + k);
            for (var col = 0; col < N; col++)
            {
                y1[0, col] = this.History[0, col];
            }
            pi[0, 0] = this.Phi[0, 0] - this.Theta[0, 0];
            for (var i = 1; i < s; i++)
            {
                double sum = 0;
                double t = 0;
                double t1 = 0;
                double t2 = 0;
                for (var j = 0; j < i - 1; j++)
                {
                    if (i - j > q)
                    {
                        t = 0;
                    }
                    else
                    {
                        t = this.Theta[0, i - j - 1];
                    }
                    sum = sum + t * pi[0, j];
                }
                if (i > p)
                {
                    t1 = 0;
                }
                else
                {
                    t1 = this.Phi[0, i - 1];
                }
                if (i > q)
                {
                    t2 = 0;
                }
                else
                {
                    t2 = this.Theta[0, i - 1];
                }
                pi[0, i] = t1 - t2 + sum;
            }

            for (var t = 0; t < N + k; t++)
            {
                double sum = 0;
                double t3 = 0;
                for (var i = 0; i < s; i++)
                {
                    if (t - i <= 0)
                    {
                        t3 = 0;
                    }
                    else
                    {
                        t3 = y1[0, t - i];
                    }
                    sum = sum + pi[0, i] * t3;
                }
                yhat[0, t] = sum;
                if (t > N)
                {
                    y1[0, t] = yhat[0, t];
                }
            }
            return yhat;
        }

        private Matrix History { get; set; }
        private Matrix Phi { get; set; }
        private Matrix Theta { get; set; }
        #endregion
        #endregion
    }
}
