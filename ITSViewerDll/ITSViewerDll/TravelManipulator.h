

#pragma once
// #include <osgGA/GUIActionAdapter>
// #include <osgGA/GUIEventAdapter>
// #include <osgGA/GUIEventHandler>
// #include <osg/Matrixd>
#include "Common.h"




class TravelManipulator :
	public osgGA::CameraManipulator
{
public:
	TravelManipulator(void);
	~TravelManipulator(void);

public:
	virtual void setByMatrix(const osg::Matrixd& matrix);
	virtual void setByInverseMatrix(const osg::Matrixd& matrix);
	virtual osg::Matrixd getMatrix() const;
	virtual osg::Matrixd getInverseMatrix() const;

	bool handle(const osgGA::GUIEventAdapter& ea, osgGA::GUIActionAdapter& us);


	//改变位置
	void ChangePosition(double delte_X, double delte_Y, double delte_Z);
	void ChangePosition(osg::Vec3d &delte);
	void ChangeRotation(double delte_X, double delte_Y, double delte_Z);
	void ChangeRotation(osg::Vec3d &delta);

	//设置步长
	void setStep(int step);
	//得到步长
	int getStep();
	//设置到某点
	void setPosition(osg::Vec3d &position);
	//得到当前坐标
	osg::Vec3d getPosition();
	//得到当前旋转的角度坐标
	osg::Vec3d getRotation();


	void setWander(bool wander)
	{
		m_isWander = wander;
		//ButtonMode::m_cameraFollow = false;
	}


private:
	//视点
	osg::Vec3 m_vPosition;
	//朝向
	osg::Vec3 m_vRotation;
	//移动步长
	int m_iSpeed;
	//旋转步长
	float m_fRotateStep;
	//记录坐标（鼠标滑动）
	int m_ileftX;
	int m_ileftY;
	bool m_bleftdown;
	//是否漫游
	bool m_isWander;
};

