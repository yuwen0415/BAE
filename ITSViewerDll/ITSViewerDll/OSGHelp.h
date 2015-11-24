#pragma once




#include <osgViewer/Viewer>
#include <osgViewer/ViewerEventHandlers>
#include <osgViewer/api/win32/GraphicsWindowWin32>
#include <osgGA/TrackballManipulator>
#include <osgGA/KeySwitchMatrixManipulator>
#include <osgDB/DatabasePager>
#include <osgDB/Registry>
#include <osgDB/ReadFile>
#include <osgUtil/Optimizer>
#include <string>
#include "SkyDome.h"
#include "TravelManipulator.h"
#include "ControlHandler.h"
#include "Cylinder.h"

class cOSG
{
public:
	cOSG(HWND hWnd);
	~cOSG();

	void InitOSG(std::string filename);
	void InitManipulators(void);
	void InitSceneGraph(void);
	void InitCameraConfig(void);
	void SetupWindow(void);
	void SetupCamera(void);
	void PreFrameUpdate(void);
	void PostFrameUpdate(void);
	void Done(bool value) { mDone = value; }
	bool Done(void) { return mDone; }
	//static void Render(void* ptr);

	osg::ref_ptr<osgViewer::Viewer> getViewer() { return mViewer; }
	//…„œÒª˙Œª÷√æÿ’Û
	osg::ref_ptr<TravelManipulator> travelManipulator;
	osg::ref_ptr<ControlHandler> controlHandler;


private:
	bool mDone;
	std::string m_ModelName;
	HWND m_hWnd;
	osg::ref_ptr<osgViewer::Viewer> mViewer;
	osg::ref_ptr<osg::Group> mRoot;
	osg::ref_ptr<osgGA::TrackballManipulator> trackball;
	osg::ref_ptr<osgOcean::OceanScene> mOceanscene;

	void InitSkyDome();
	void AddOcean();
	void AddShip();
	
};

class CRenderingThread : public OpenThreads::Thread
{
public:
	CRenderingThread(cOSG* ptr);
	virtual ~CRenderingThread();

	virtual void run();

protected:
	cOSG* _ptr;
	bool _done;
};
