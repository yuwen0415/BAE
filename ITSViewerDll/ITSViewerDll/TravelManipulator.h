

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


	//�ı�λ��
	void ChangePosition(double delte_X, double delte_Y, double delte_Z);
	void ChangePosition(osg::Vec3d &delte);
	void ChangeRotation(double delte_X, double delte_Y, double delte_Z);
	void ChangeRotation(osg::Vec3d &delta);

	//���ò���
	void setStep(int step);
	//�õ�����
	int getStep();
	//���õ�ĳ��
	void setPosition(osg::Vec3d &position);
	//�õ���ǰ����
	osg::Vec3d getPosition();
	//�õ���ǰ��ת�ĽǶ�����
	osg::Vec3d getRotation();


	void setWander(bool wander)
	{
		m_isWander = wander;
		//ButtonMode::m_cameraFollow = false;
	}


private:
	//�ӵ�
	osg::Vec3 m_vPosition;
	//����
	osg::Vec3 m_vRotation;
	//�ƶ�����
	int m_iSpeed;
	//��ת����
	float m_fRotateStep;
	//��¼���꣨��껬����
	int m_ileftX;
	int m_ileftY;
	bool m_bleftdown;
	//�Ƿ�����
	bool m_isWander;
};

