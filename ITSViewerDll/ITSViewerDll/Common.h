#ifndef _COMMON_H__
#define _COMMON_H__
#endif

//**屏蔽黑色的DOS框,release中没有，debug情况下有
#ifndef _DEBUG
#pragma comment(lib,"winmm.lib") // 告诉连接器与这个库连接，因为我们要播放多媒体声音
#pragma comment( linker, "/subsystem:\"windows\" /entry:\"mainCRTStartup\"" )  // 设置连接器选项
#endif


#ifdef _DEBUG
#pragma comment(lib, "osgd.lib")
#pragma comment(lib, "osgDBd.lib")
#pragma comment(lib, "osgViewerd.lib")
#pragma comment(lib, "OpenThreadsd.lib")
#pragma comment(lib, "osgGAd.lib")
#pragma comment(lib, "osgUtild.lib")
#pragma comment(lib, "osgTextd.lib")
//#pragma comment(lib, "osgWidgetd.lib")
// #pragma comment(lib, "CEGUIBase_d.lib")
//#pragma comment(lib, "OpenGLGUIRenderer_d.lib")
//#pragma comment(lib, "glew32.lib") 
#pragma comment(lib, "glu32.lib") 
#pragma comment(lib, "opengl32.lib")
//#pragma comment(lib, "osgShadowd.lib")
//#pragma comment(lib, "osgAnimationd.lib")
//#pragma comment(lib, "osgParticled.lib")
#pragma comment(lib, "fftssD.lib")
#pragma comment(lib, "osgOceand.lib")
#else
#pragma comment(lib, "osg.lib")
#pragma comment(lib, "osgDB.lib")
#pragma comment(lib, "osgViewer.lib")
#pragma comment(lib, "OpenThreads.lib")
#pragma comment(lib, "osgGA.lib")
#pragma comment(lib, "osgUtil.lib")
#pragma comment(lib, "osgText.lib")
//#pragma comment(lib, "osgWidget.lib")
// #pragma comment(lib, "CEGUIBase.lib")
// #pragma comment(lib, "OpenGLGUIRenderer.lib")
//#pragma comment(lib, "glew32.lib") 
#pragma comment(lib, "glu32.lib") 
#pragma comment(lib, "opengl32.lib")
//#pragma comment(lib, "osgShadow.lib")
//#pragma comment(lib, "osgAnimation.lib")
//#pragma comment(lib, "osgParticle.lib")
//#pragma comment(lib, "fftss.lib")
#pragma comment(lib, "osgOcean.lib")
#endif




#include <osgViewer/Viewer>
#include <osg/GraphicsContext>
#include <osgGA/GUIEventHandler>
#include <osgGA/GUIActionAdapter>
#include <osgGA/CameraManipulator>
#include <osg/Matrixd>
#include <osg/TextureCubeMap>
#include <stdio.h>
#include <osg/Vec2f>
#include <osgGA/TrackballManipulator>
#include <osgViewer/ViewerEventHandlers>
#include <osg/ShapeDrawable>
#include <osg/Geode>
#include <osgText/Text>
#include <iostream>
#include <osgDB/ReadFile>
#include <osgUtil/LineSegmentIntersector>
#include <osgUtil/IntersectionVisitor>
//#include <osgWidget/Box>
//#include <osgWidget/Label>
//#include <osgWidget/WindowManager>
//#include <osgWidget/ViewerEventHandlers>
//#include <osgWidget/Window>
#include <osg/Switch>
#include <osgGA/StateSetManipulator>
#include <osg/MatrixTransform>
#include <osg/AnimationPath>
#include <osgParticle/PrecipitationEffect>
#include <osg/LightModel>
#include <vector>
#include <string>
#include <osgOcean/OceanScene>
#include <osgOcean/FFTOceanSurface>
#include <osgOcean/SiltEffect>
#include <osgOcean/ShaderManager>
#pragma once


class  ButtonMode
{
public:
	ButtonMode() {}
	//**添加本船按钮是否显示
	static bool m_addship;
	//**控制面板按钮是否显示
	static bool m_control;
	//**选择放弃按钮是否显示
	static bool m_SAbutton;
	//**本船信息显示板是否显示
	static bool m_shipmessage;
	//**摄像机是否跟随本船
	static bool m_cameraFollow;
	//**天气BOX是否显示
	static bool m_weatherbutton;
	//**地点BOX是否显示
	static bool m_locationbutton;
	//**本船矩阵
	static osg::Vec3d m_shipPosition;
	//**本船的前进加速度
	static float m_shipVec;
	//**本船的转向加速度
	static float m_shipAngleVec;
	//**本船的转向角
	static osg::Vec3d m_shipRotation;
	//**雾的浓度
	static float m_fogDensity;
	//**天黑程度
	static float m_darkfactor;
	//**船舶的帧数控制
	static int m_shipframe;
};

class CameraTrackCallback : public osg::NodeCallback
{
public:
	virtual void operator()(osg::Node* node, osg::NodeVisitor* nv)
	{
		if (nv->getVisitorType() == osg::NodeVisitor::CULL_VISITOR)
		{
			osgUtil::CullVisitor* cv = static_cast<osgUtil::CullVisitor*>(nv);
			osg::Vec3f centre, up, eye;
			// get MAIN camera eye,centre,up
			cv->getRenderStage()->getCamera()->getViewMatrixAsLookAt(eye, centre, up);
			// update position
			osg::MatrixTransform* mt = static_cast<osg::MatrixTransform*>(node);
			if (ButtonMode::m_fogDensity == 0.0f)
			{
				mt->setMatrix(osg::Matrix::translate(eye.x(), eye.y(), -1.0f));
			}
			else
			{
				mt->setMatrix(osg::Matrix::translate(eye.x(), eye.y(), -2000.0f));
			}

		}

		traverse(node, nv);
	}
};


class CameraTrackDataType : public osg::Referenced
{
private:
	osg::Vec3f _eye;
	osg::MatrixTransform& _pat;

public:
	CameraTrackDataType(osg::MatrixTransform& pat) :_pat(pat) {};

	inline void setEye(const osg::Vec3f& eye) { _eye = eye; }

	inline void update(void) {
		_pat.setMatrix(osg::Matrixf::translate(osg::Vec3f(_eye.x(), _eye.y(), _pat.getMatrix().getTrans().z())));
	}
};

class UniformCallback : public osg::StateSet::Callback
{
public:
	UniformCallback(osgViewer::Viewer *vw)
	{
		viewer = vw;
		vViewPosition = new osg::Uniform("vViewPosition", viewer->getCamera()->getViewMatrix().getTrans());
		osg_ViewMatrixInverse = new osg::Uniform("osg_ViewMatrixInverse", viewer->getCamera()->getInverseViewMatrix());
		fog_density = new osg::Uniform("fog_density", 0.0f);
		dark_factor = new osg::Uniform("dark_factor", 1.0f);
	}
	virtual void operator()(osg::StateSet *ss, osg::NodeVisitor *nv)
	{
		fog_density->set(0.0f);
		dark_factor->set(1.0f);
		ss->addUniform(vViewPosition);
		ss->addUniform(osg_ViewMatrixInverse);
		ss->addUniform(fog_density);
		ss->addUniform(dark_factor);
		osg::ref_ptr<osg::Program> program = dynamic_cast<osg::Program *> (ss->getAttribute(osg::StateAttribute::PROGRAM, 0));
	}

private:
	osg::ref_ptr<osg::Uniform> vViewPosition;
	osg::ref_ptr<osg::Uniform> osg_ViewMatrixInverse;
	osg::ref_ptr<osg::Uniform> fog_density;
	osg::ref_ptr<osg::Uniform> dark_factor;
	osg::ref_ptr<osgViewer::Viewer> viewer;
};