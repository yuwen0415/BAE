#pragma once


#include <string>
#include "windows.h"  
#include "Common.h"


extern "C"
{
	//视频加载和启动相关函数
	_declspec(dllexport) void PlayScene();
	_declspec(dllexport) void LoadScene(char fileName[]);
	_declspec(dllexport) void Initialize(HWND hWnd);
	_declspec(dllexport) void Stop();

	//摄像机位置控制命令
	_declspec(dllexport) void ChangePosition(double delte_X, double delte_Y, double delte_Z);
	_declspec(dllexport) void ChangeRotation(double delte_X, double delte_Y, double delte_Z);

	_declspec(dllexport) float GetRotationX();
	_declspec(dllexport) float GetRotationY();
	_declspec(dllexport) float GetRotationZ();


	_declspec(dllexport) void ChangeScenceModel(char modelfile[]);
	_declspec(dllexport) void DynamicPositionChangeModel(float screenX,float screenY,char modelfile[]);
	_declspec(dllexport) void DynamicPositionChangeModelByViewer(char modelfile[]);

	_declspec(dllexport) int Test(int a, int b);


}
