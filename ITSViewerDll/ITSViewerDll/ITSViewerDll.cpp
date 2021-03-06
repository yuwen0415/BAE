#ifndef DLL_EXPORTS
#define DLL_EXPORTS
#endif


#include "ITSViewerDll.h"
#include "OSGHelp.h"


#pragma comment(linker,"/section:shared,rws")  
#pragma data_seg("shared")
int var = 0;
#pragma data_seg()


static cOSG *m_osg;
static CRenderingThread* mThreadHandle;

static bool IsWander = true;

void PlayScene()
{
	mThreadHandle = new CRenderingThread(m_osg);
	mThreadHandle->start();
}

void LoadScene(char fileName[])
{
	m_osg->InitOSG(fileName);
}

void Initialize(HWND hWnd)
{
	m_osg = new cOSG(hWnd);
}


void Stop()
{
	delete mThreadHandle;
	if (m_osg != 0) delete m_osg;
}


void ChangePosition(double delte_X, double delte_Y, double delte_Z)
{
	m_osg->travelManipulator->ChangePosition(delte_X, delte_Y, delte_Z);
}

void ChangeRotation(double delte_X, double delte_Y, double delte_Z)
{
	m_osg->travelManipulator->ChangeRotation(delte_X, delte_Y, delte_Z);
}

float GetRotationX()
{
	return m_osg->travelManipulator->getRotation()[0];
}

float GetRotationY()
{
	return m_osg->travelManipulator->getRotation()[1];
}

float GetRotationZ()
{
	return m_osg->travelManipulator->getRotation()[2];
}

void ChangeScenceModel(char modelfile[])
{
	m_osg->controlHandler->ChangeScenceModel(modelfile);
}

void DynamicPositionChangeModel(float screenX, float screenY, char modelfile[])
{
	m_osg->controlHandler->DynamicPositionChangeModel(screenX, screenY, modelfile);
}

void DynamicPositionChangeModelByViewer(char modelfile[])
{
	m_osg->controlHandler->DynamicPositionChangeModel(modelfile);
}

void SetFollowShip()
{
	m_osg->controlHandler->SetCameraFollowShip();
	m_osg->travelManipulator->setWander(false);
}

void SetWander()
{
	m_osg->controlHandler->SetCameraWander();
	m_osg->travelManipulator->setWander(true);
}

void ShipVecSpeedUp()
{
	m_osg->controlHandler->ShipVecSpeedUp();
}
void ShipAngleVecSpeedUp()
{
	m_osg->controlHandler->ShipAngleVecSpeedUp();
}
void ReduceShipVec()
{
	m_osg->controlHandler->ReduceShipVec();
}
void ReduceShipAngleVec()
{
	m_osg->controlHandler->ReduceShipAngleVec();
}


int Test(int a, int b)
{
	return a + b;
}