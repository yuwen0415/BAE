using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Algorithm
{
    public class BPAlgorithm : IAlgorithm
    {
        private Dictionary<string, object> _Parameters
        {
            get;
            set;
        }

        /// <summary>
        /// 三个参数：1、“HistoryData”（double[，]），历史数据；
        ///          2、“TrainingInData”（double[,]）,训练输入集；
        ///          3、“TrainingOutData”（double[,]）,训练输出集;
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
                return Caculator();
            }
            catch (Exception e)
            {
                throw e;
            }
        }



        private double[] Caculator()
        {
            this.Initialize(TrainingInData, TrainingOutData);
            int study = 0;
            do
            {
                study++;
                this.train(TrainingInData, TrainingOutData);
            } while (e > 0.001 && study < 50000);
            int aa = inNum;
            int bb = outNum;
            int cc = HistoryData.GetLength(0);
            double[] p21 = new double[aa];
            double[] t2 = new double[bb];
            for (int n = 0; n < cc; n++)
            {
                for (int i = 0; i < aa; i++)
                {
                    p21[i] = HistoryData[n, i];
                }
                t2 = sim(p21);
            }
            return t2;
        }

        private double[,] HistoryData
        {
            get
            {
                return (double[,])Parameters["HistoryData"];
            }
        }

        private double[,] TrainingInData
        {
            get
            {
                return (double[,])Parameters["TrainingInData"];
            }
        }

        private double[,] TrainingOutData
        {
            get
            {
                return (double[,])Parameters["TrainingOutData"];
            }
        }


        #region 算法实现

        public int inNum;//输入节点数
        int hideNum;//隐层节点数
        public int outNum;//输出层节点数
        public int sampleNum;//样本总数

        Random R;
        double[] x;//输入节点的输入数据
        double[] x1;//隐层节点的输出
        double[] x2;//输出节点的输出

        double[] o1;//隐层的输入
        double[] o2;//输出层的输入
        public double[,] w;//权值矩阵w
        public double[,] v;//权值矩阵V
        public double[,] dw;//权值矩阵w
        public double[,] dv;//权值矩阵V


        public double rate;//学习率
        public double[] b1;//隐层阈值矩阵
        public double[] b2;//输出层阈值矩阵
        public double[] db1;//隐层阈值矩阵
        public double[] db2;//输出层阈值矩阵

        double[] pp;//输出层的误差
        double[] qq;//隐层的误差
        double[] yd;//输出层的教师数据
        public double e;//均方误差
        double in_rate;//归一化比例系数

        public int computeHideNum(int m, int n)
        {
            double s = Math.Sqrt(0.43 * m * n + 0.12 * n * n + 2.54 * m + 0.77 * n + 0.35) + 0.51;
            int ss = Convert.ToInt32(s);
            return ((s - (double)ss) > 0.5) ? ss + 1 : ss;

        }
        public void Initialize(double[,] p, double[,] t)
        {

            // 构造函数逻辑
            R = new Random();

            this.inNum = p.GetLength(1);
            this.outNum = t.GetLength(1);
            this.hideNum = computeHideNum(inNum, outNum);
            //      this.hideNum=18;
            this.sampleNum = p.GetLength(0);

            Console.WriteLine("输入节点数目： " + inNum);
            Console.WriteLine("隐层节点数目：" + hideNum);
            Console.WriteLine("输出层节点数目：" + outNum);

            Console.ReadLine();

            x = new double[inNum];
            x1 = new double[hideNum];
            x2 = new double[outNum];

            o1 = new double[hideNum];
            o2 = new double[outNum];

            w = new double[inNum, hideNum];
            v = new double[hideNum, outNum];
            dw = new double[inNum, hideNum];
            dv = new double[hideNum, outNum];

            b1 = new double[hideNum];
            b2 = new double[outNum];
            db1 = new double[hideNum];
            db2 = new double[outNum];

            pp = new double[hideNum];
            qq = new double[outNum];
            yd = new double[outNum];

            //初始化w
            for (int i = 0; i < inNum; i++)
            {
                for (int j = 0; j < hideNum; j++)
                {
                    w[i, j] = (R.NextDouble() * 2 - 1.0) / 2;
                }
            }

            //初始化v
            for (int i = 0; i < hideNum; i++)
            {
                for (int j = 0; j < outNum; j++)
                {
                    v[i, j] = (R.NextDouble() * 2 - 1.0) / 2;
                }
            }

            rate = 0.8;
            e = 0.0;
            in_rate = 1.0;
        }

        //训练函数
        public void train(double[,] p, double[,] t)
        {
            e = 0.0;
            //求p，t中的最大值
            double pMax = 0.0;
            for (int isamp = 0; isamp < sampleNum; isamp++)
            {
                for (int i = 0; i < inNum; i++)
                {
                    if (Math.Abs(p[isamp, i]) > pMax)
                    {
                        pMax = Math.Abs(p[isamp, i]);
                    }
                }

                for (int j = 0; j < outNum; j++)
                {
                    if (Math.Abs(t[isamp, j]) > pMax)
                    {
                        pMax = Math.Abs(t[isamp, j]);
                    }
                }

                in_rate = pMax;
            }//end isamp



            for (int isamp = 0; isamp < sampleNum; isamp++)
            {
                //数据归一化
                for (int i = 0; i < inNum; i++)
                {
                    x[i] = p[isamp, i] / in_rate;
                }
                for (int i = 0; i < outNum; i++)
                {
                    yd[i] = t[isamp, i] / in_rate;
                }

                //计算隐层的输入和输出

                for (int j = 0; j < hideNum; j++)
                {
                    o1[j] = 0.0;
                    for (int i = 0; i < inNum; i++)
                    {
                        o1[j] += w[i, j] * x[i];
                    }
                    x1[j] = 1.0 / (1.0 + Math.Exp(-o1[j] - b1[j]));
                }

                //计算输出层的输入和输出
                for (int k = 0; k < outNum; k++)
                {
                    o2[k] = 0.0;
                    for (int j = 0; j < hideNum; j++)
                    {
                        o2[k] += v[j, k] * x1[j];
                    }
                    x2[k] = 1.0 / (1.0 + Math.Exp(-o2[k] - b2[k]));
                }

                //计算输出层误差和均方差

                for (int k = 0; k < outNum; k++)
                {
                    qq[k] = (yd[k] - x2[k]) * x2[k] * (1.0 - x2[k]);
                    e += (yd[k] - x2[k]) * (yd[k] - x2[k]);
                    //更新V
                    for (int j = 0; j < hideNum; j++)
                    {
                        v[j, k] += rate * qq[k] * x1[j];
                    }
                }

                //计算隐层误差

                for (int j = 0; j < hideNum; j++)
                {
                    pp[j] = 0.0;
                    for (int k = 0; k < outNum; k++)
                    {
                        pp[j] += qq[k] * v[j, k];
                    }
                    pp[j] = pp[j] * x1[j] * (1 - x1[j]);

                    //更新W

                    for (int i = 0; i < inNum; i++)
                    {
                        w[i, j] += rate * pp[j] * x[i];
                    }
                }

                //更新b2
                for (int k = 0; k < outNum; k++)
                {
                    b2[k] += rate * qq[k];
                }

                //更新b1
                for (int j = 0; j < hideNum; j++)
                {
                    b1[j] += rate * pp[j];
                }

            }//end isamp
            e = Math.Sqrt(e);
            //      adjustWV(w,dw);
            //      adjustWV(v,dv);


        }//end train

        public void adjustWV(double[,] w, double[,] dw)
        {
            for (int i = 0; i < w.GetLength(0); i++)
            {
                for (int j = 0; j < w.GetLength(1); j++)
                {
                    w[i, j] += dw[i, j];
                }
            }

        }

        public void adjustWV(double[] w, double[] dw)
        {
            for (int i = 0; i < w.Length; i++)
            {

                w[i] += dw[i];

            }

        }

        //数据仿真函数

        public double[] sim(double[] psim)
        {
            for (int i = 0; i < inNum; i++)
                x[i] = psim[i] / in_rate;

            for (int j = 0; j < hideNum; j++)
            {
                o1[j] = 0.0;
                for (int i = 0; i < inNum; i++)
                    o1[j] = o1[j] + w[i, j] * x[i];
                x1[j] = 1.0 / (1.0 + Math.Exp(-o1[j] - b1[j]));
            }
            for (int k = 0; k < outNum; k++)
            {
                o2[k] = 0.0;
                for (int j = 0; j < hideNum; j++)
                    o2[k] = o2[k] + v[j, k] * x1[j];
                x2[k] = 1.0 / (1.0 + Math.Exp(-o2[k] - b2[k]));

                x2[k] = in_rate * x2[k];

            }

            return x2;
        } //end sim

        #endregion
    }
}
