#include "ShipTravelManipulator.h"



ShipTravelManipulator::ShipTravelManipulator(osg::ref_ptr<osg::MatrixTransform> shipMT)
{
	ShipMT = shipMT;
	m_shipPosotion = shipMT->getMatrix().getTrans();
	m_shipRotation = 0.0f;
}


ShipTravelManipulator::~ShipTravelManipulator()
{
}

void ShipTravelManipulator::VecSpeedUp()
{
	m_shipVec += deltaVec;
}

void ShipTravelManipulator::AngleVecSpeedUp()
{
	m_shipAngleVec += deltaAngleVec;
}

void ShipTravelManipulator::ReduceVec()
{
	m_shipVec -= deltaVec;
}

void ShipTravelManipulator::ReduceAngleVec()
{
	m_shipAngleVec -= deltaAngleVec;
}

void ShipTravelManipulator::Move()
{
	osg::Matrixd mat;
	m_shipPosotion = ShipMT->getMatrix().getTrans();
	//m_shipRotation = ShipMT->getMatrix().getRotate();
	if (m_shipVec != 0.0f)
	{
		m_shipRotation += m_shipAngleVec;
	}
	mat.makeRotate(osg::Quat(0, osg::X_AXIS, 0, osg::Y_AXIS, m_shipRotation, osg::Z_AXIS));
	m_shipPosotion += osg::Vec3d(m_shipVec*cosf(osg::PI_2 + m_shipRotation), m_shipVec*sinf(osg::PI_2 + m_shipRotation), 0.0f);

	ShipMT->setMatrix(mat*osg::Matrix::translate(m_shipPosotion));
}

osg::Vec3f ShipTravelManipulator::GetShipPosition()
{
	return this->m_shipPosotion;
}
float ShipTravelManipulator::GetShipRotation()
{
	return this->m_shipRotation;
}