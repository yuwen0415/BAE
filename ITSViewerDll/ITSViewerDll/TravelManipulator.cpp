#include "TravelManipulator.h"


bool ButtonMode::m_addship = false;
bool ButtonMode::m_control = false;
bool ButtonMode::m_shipmessage = false;
bool ButtonMode::m_SAbutton = false;
bool ButtonMode::m_cameraFollow = false;
bool ButtonMode::m_weatherbutton = false;
bool ButtonMode::m_locationbutton = false;
float ButtonMode::m_shipVec = 0.0f;
float ButtonMode::m_shipAngleVec = 0.0f;
osg::Vec3d ButtonMode::m_shipRotation = osg::Vec3d(0.0f, 0.0f, 0.0f);
osg::Vec3d ButtonMode::m_shipPosition = osg::Vec3d(0.0f, 0.0f, 0.0f);
float ButtonMode::m_fogDensity = 0.0f;
float ButtonMode::m_darkfactor = 1.0f;
int ButtonMode::m_shipframe = 0;

TravelManipulator::TravelManipulator(void)
{
	m_vPosition = osg::Vec3(0, -40, 0);
	m_vRotation = osg::Vec3(osg::PI_2, 0, 0);
	m_iSpeed = 50;
	m_fRotateStep = 0.0;
	m_bleftdown = false;
	m_ileftX = 0;
	m_ileftY = 0;
	m_isWander = true;
}

TravelManipulator::~TravelManipulator(void)
{
}


void TravelManipulator::ChangePosition(double delte_X, double delte_Y, double delte_Z)
{
	osg::Vec3d delta = osg::Vec3d(delte_X, delte_Y, delte_Z);
	this->ChangePosition(delta);
}

void TravelManipulator::ChangePosition(osg::Vec3d &delta)
{
	m_vPosition += delta;
}

void TravelManipulator::ChangeRotation(double delte_X, double delte_Y, double delte_Z)
{
	osg::Vec3d delta = osg::Vec3d(delte_X, delte_Y, delte_Z);
	this->ChangeRotation(delta);
}

void TravelManipulator::ChangeRotation(osg::Vec3d &delta)
{
	m_vRotation += delta;
}

void TravelManipulator::setByMatrix(const osg::Matrixd& matrix)
{

}
void TravelManipulator::setByInverseMatrix(const osg::Matrixd& matrix)
{

}



osg::Matrixd TravelManipulator::getInverseMatrix() const
{
	osg::Matrixd mat;
	mat.makeTranslate(m_vPosition);
	return osg::Matrixd::inverse(osg::Matrixd::rotate(m_vRotation[0], osg::X_AXIS, m_vRotation[1], osg::Y_AXIS, m_vRotation[2], osg::Z_AXIS)*mat);
}


osg::Matrixd TravelManipulator::getMatrix() const
{
	osg::Matrixd mat;
	mat.makeTranslate(m_vPosition);
	return osg::Matrixd::rotate(m_vRotation[0], osg::X_AXIS, m_vRotation[1], osg::Y_AXIS, m_vRotation[2], osg::Z_AXIS)*mat;
}


bool TravelManipulator::handle(const osgGA::GUIEventAdapter& ea, osgGA::GUIActionAdapter& us)
{
	if (ButtonMode::m_cameraFollow)
	{
		switch (ea.getEventType())
		{
		case osgGA::GUIEventAdapter::FRAME:
		{
			m_vPosition = osg::Vec3d(ButtonMode::m_shipPosition.x(), ButtonMode::m_shipPosition.y(), 10.0f);
			m_vRotation[2] = ButtonMode::m_shipRotation[2];
			//if (ButtonMode::m_shipframe == 10)
			//{					
			if (ButtonMode::m_shipVec != 0.0f)
			{
				m_vRotation[2] += ButtonMode::m_shipAngleVec;
			}
			m_vPosition += osg::Vec3d(ButtonMode::m_shipVec*cosf(osg::PI_2 + ButtonMode::m_shipRotation[2]), ButtonMode::m_shipVec*sinf(osg::PI_2 + ButtonMode::m_shipRotation[2]), 0.0f);
			//}

		}
		//			std::cout<<"2  "<<m_vRotation[2]<<std::endl;
		break;
		}
	}

	if (m_isWander)
	{
		switch (ea.getEventType())
		{
		//case osgGA::GUIEventAdapter::KEYDOWN:
		//{
		//	if (ea.getKey() == 'w' || ea.getKey() == 'W' || ea.getKey() == osgGA::GUIEventAdapter::KEY_Up)
		//	{
		//		ChangePosition(osg::Vec3d(m_iSpeed*cosf(osg::PI_2 + m_vRotation[2]), m_iSpeed*sinf(osg::PI_2 + m_vRotation[2]), 0));
		//		//std::cout<<m_vPosition.x()<<"  "<<m_vPosition.y()<<std::endl;
		//		return true;
		//	}
		//	else if (ea.getKey() == 's' || ea.getKey() == 'S' || ea.getKey() == osgGA::GUIEventAdapter::KEY_Down)
		//	{
		//		ChangePosition(osg::Vec3d(-m_iSpeed*cosf(osg::PI_2 + m_vRotation[2]), -m_iSpeed*sinf(osg::PI_2 + m_vRotation[2]), 0));
		//		return true;
		//	}
		//	else if (ea.getKey() == 'a' || ea.getKey() == 'A')
		//	{
		//		ChangePosition(osg::Vec3d(-m_iSpeed*sinf(osg::PI_2 + m_vRotation[2]), m_iSpeed*cosf(osg::PI_2 + m_vRotation[2]), 0));
		//		return true;
		//	}
		//	else if (ea.getKey() == 'd' || ea.getKey() == 'D')
		//	{
		//		ChangePosition(osg::Vec3d(m_iSpeed*sinf(osg::PI_2 + m_vRotation[2]), -m_iSpeed*cosf(osg::PI_2 + m_vRotation[2]), 0));
		//		return true;
		//	}
		//	else if (ea.getKey() == osgGA::GUIEventAdapter::KEY_Left)
		//	{
		//		m_vRotation[2] += 0.2;
		//		return true;
		//	}
		//	else if (ea.getKey() == osgGA::GUIEventAdapter::KEY_Right)
		//	{
		//		m_vRotation[2] -= 0.2;
		//		return true;
		//	}
		//	else if (ea.getKey() == 'q' || ea.getKey() == 'Q')
		//	{
		//		ChangePosition(osg::Vec3d(0, 0, -1));
		//		return true;
		//	}
		//	else if (ea.getKey() == 'e' || ea.getKey() == 'E')
		//	{
		//		ChangePosition(osg::Vec3d(0, 0, 1));
		//		return true;
		//	}
		//	//**按Tab键实现摄像机90度旋转
		//	else if (ea.getKey() == osgGA::GUIEventAdapter::KEY_Tab)
		//	{
		//		m_vRotation[0] -= osg::PI_2;
		//		return true;
		//	}
		//}
		//break;

		//鼠标滑动
		case osgGA::GUIEventAdapter::PUSH:
		{
			if (ea.getButton() == osgGA::GUIEventAdapter::LEFT_MOUSE_BUTTON)
			{
				m_ileftX = ea.getX();
				m_ileftY = ea.getY();
				m_bleftdown = true;
			}
			return false;
		}
		break;
		case osgGA::GUIEventAdapter::DRAG:
		{
			if (m_bleftdown == true)
			{
				int delX = ea.getX() - m_ileftX;
				m_vRotation[2] += osg::DegreesToRadians(0.001 * delX);
				int delY = ea.getY() - m_ileftY;
				m_vRotation[0] += osg::DegreesToRadians(0.001 * delY);
				if (m_vRotation[0] <= 0)
				{
					m_vRotation[0] = 0;
				}
				if (m_vRotation[0] >= osg::PI)
				{
					m_vRotation[0] = osg::PI;
				}
			}
		}
		break;
		case osgGA::GUIEventAdapter::RELEASE:
		{
			if (ea.getButton() == osgGA::GUIEventAdapter::LEFT_MOUSE_BUTTON)
			{
				m_bleftdown = false;
			}
		}
		break;
		}
	}

	return false;
}




//设置步长
void TravelManipulator::setStep(int step)
{
	m_iSpeed = step;
}
//得到步长
int TravelManipulator::getStep()
{
	return m_iSpeed;
}
//设置到某点
void TravelManipulator::setPosition(osg::Vec3d &position)
{
	m_vPosition = position;
}
//得到当前坐标
osg::Vec3d TravelManipulator::getPosition()
{
	return m_vPosition;
}

osg::Vec3d TravelManipulator::getRotation()
{
	return m_vRotation;
}