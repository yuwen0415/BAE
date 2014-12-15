using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;

namespace EXLibrary.Algorithm
{
    public class ESAlgorithm : IAlgorithm
    {
        private Dictionary<string, object> _Parameters
        {
            get;
            set;
        }

        /// <summary>
        /// 一个参数：1、“HistoryData”（double[]），历史数据；
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
            //            double[] test = new double[]{0.814723686393179,
            //0.905791937075619   ,
            //0.126986816293506   ,
            //0.913375856139019   ,
            //0.632359246225410   ,
            //0.0975404049994095  ,
            //0.278498218867048   ,
            //0.546881519204984   ,
            //0.957506835434298   ,
            //0.964888535199277   ,
            //0.157613081677548   ,
            //0.970592781760616   ,
            //0.957166948242946   ,
            //0.485375648722841   ,
            //0.800280468888800   ,
            //0.141886338627215   ,
            //0.421761282626275   ,
            //0.915735525189067   ,
            //0.792207329559554   ,
            //0.959492426392903   ,
            //0.655740699156587   ,
            //0.0357116785741896  ,
            //0.849129305868777   ,
            //0.933993247757551   ,
            //0.678735154857774   ,
            //0.757740130578333   ,
            //0.743132468124916   ,
            //0.392227019534168   ,
            //0.655477890177557   ,
            //0.171186687811562   ,
            //0.706046088019609   ,
            //0.0318328463774207  ,
            //0.276922984960890   ,
            //0.0461713906311539  ,
            //0.0971317812358475  ,
            //0.823457828327293   ,
            //0.694828622975817   ,
            //0.317099480060861   ,
            //0.950222048838355   ,
            //0.0344460805029088  ,
            //0.438744359656398   ,
            //0.381558457093008   ,
            //0.765516788149002   ,
            //0.795199901137063   ,
            //0.186872604554379   ,
            //0.489764395788231   ,
            //0.445586200710900   ,
            //0.646313010111265   ,
            //0.709364830858073   ,
            //0.754686681982361   ,

            //};
            try
            {
                //Debugger.Launch();
                var history = (double[])(Parameters["HistoryData"]);
                return new double[] { ExpSmoothOrder1(history, new float[] { 0.5f }) };
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        private double ExpSmoothOrder1(double[] x, float[] alpha)
        {
            if (alpha[0] <= 0 || alpha[0] > 1)
            {
                throw new Exception();
            }
            double y = 0;
            int dataLength = x.Length;
            double sum = 0;
            if (dataLength == 1)
            {
                y = x[0];
            }
            else
            {
                for (int i = dataLength; i >= 1; i--)
                {
                    sum = sum + alpha[0] * x[i - 1] * Math.Pow((1 - alpha[0]), (dataLength - i));
                }
                y = sum + Math.Pow((1 - alpha[0]), dataLength) * x[0];
            }

            return y;
        }

        private double ExpSmoothOrder2(double[] x, float[] alpha)
        {
            double[] tempt = new double[x.Length];
            for (int i = 0; i < x.Length; i++)
            {
                tempt[i] = ExpSmoothOrder1(x.Take(i + 1).ToArray(), alpha);
            }
            return ExpSmoothOrder1(tempt, alpha);
        }

        /// <summary>
        /// alpha 的值为0---1
        /// </summary>
        /// <param name="x"></param>
        /// <param name="alpha"></param>
        /// <param name="step"></param>
        /// <param name="forcastLength"></param>
        /// <param name="order1"></param>
        /// <returns></returns>
        private double[] ESForecast(double[] x, float[] alpha, int step, int forcastLength, bool order1 = true)
        {
            var dataNum = x.Length;
            var outputFore = new double[forcastLength];
            var regressionData = new Matrix(dataNum + forcastLength, forcastLength);

            for (int i = 0; i < dataNum - step + 1; i++)
            {
                var inputX = x.Skip(i + 1).Take(step).ToArray();
                for (int j = 0; j < forcastLength; j++)
                {
                    double y1;
                    if (order1)
                    {
                        y1 = ExpSmoothOrder1(inputX, alpha);
                    }
                    else
                    {
                        y1 = ExpSmoothOrder2(inputX, alpha);
                    }
                    outputFore[j] = y1;
                    var list = inputX.Skip(1).Take(step - 1).ToList();
                    list.Add(y1);
                    inputX = list.ToArray();
                }
            }
            return outputFore;
        }
    }
}
