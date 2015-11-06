/*
* This source file is part of the osgOcean library
* 
* Copyright (C) 2009 Kim Bale
* Copyright (C) 2009 The University of Hull, UK
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Lesser General Public License as published by the Free Software
* Foundation; either version 3 of the License, or (at your option) any later
* version.

* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
* http://www.gnu.org/copyleft/lesser.txt.
*/

#include "SkyDome.h"
#include "ShaderManager.h"

SkyDome::SkyDome( void )
{
	
}

SkyDome::SkyDome( const SkyDome& copy, const osg::CopyOp& copyop ):
    SphereSegment( copy, copyop )
{

}

	SkyDome::SkyDome( float radius, unsigned int longSteps, unsigned int latSteps, osg::TextureCubeMap* cubemap, osgViewer::Viewer *vw )
{
	compute( radius, longSteps, latSteps, 90.f, 180.f, 0.f, 360.f );
    setupStateSet(cubemap,vw);
	viewer = vw;
}

SkyDome::~SkyDome(void)
{
}

void SkyDome::create( float radius, unsigned int latSteps, unsigned int longSteps, osg::TextureCubeMap* cubemap,osgViewer::Viewer *vw )
{
    compute( radius, longSteps, latSteps, 90.f, 180.f, 0.f, 360.f );
    setupStateSet(cubemap,vw);
}

void SkyDome::setupStateSet( osg::TextureCubeMap* cubemap,osgViewer::Viewer *vw)
{
    osg::StateSet* ss = new osg::StateSet;

    ss->setMode(GL_LIGHTING, osg::StateAttribute::ON);
    ss->setTextureAttributeAndModes( 0, cubemap, osg::StateAttribute::ON );
    ss->setAttributeAndModes( createShader().get(), osg::StateAttribute::ON );
    ss->addUniform( new osg::Uniform("uEnvironmentMap", 0));
	ss->addUniform(	new osg::Uniform("vViewPosition",vw->getCamera()->getViewMatrix().getTrans()));
	ss->addUniform(new osg::Uniform("osg_ViewMatrixInverse",vw->getCamera()->getInverseViewMatrix()));
	ss->addUniform(new osg::Uniform("fog_density",0.0f));
	ss->addUniform(new osg::Uniform("dark_factor",1.0f));
//	ss->setUpdateCallback(new UniformCallback(vw));
    setStateSet(ss);
	
}

osg::ref_ptr<osg::Program> SkyDome::createShader(void)
{
    osg::ref_ptr<osg::Program> program = new osg::Program;

    // Do not use shaders if they were globally disabled.
    if (ShaderManager::instance().areShadersEnabled())
    {
        char vertexSource[]=
			"   uniform float fog_density; \n"
            "	varying vec3 vTexCoord;\n"
			"	uniform vec3 vViewPosition;                  \n"	
			"   varying float fogFactor;              //ÎíµÄÈ¨ÖØ \n"
			"	uniform mat4 osg_ViewMatrixInverse;		\n"
			"   void main(void)                                      \n"	
			"	{          \n"
			"       vTexCoord = gl_Vertex.xyz;\n"
			"		gl_Position = ftransform();              \n"
			"		vec4 worldVertex = (osg_ViewMatrixInverse*gl_ModelViewMatrix) * gl_Vertex;		\n"
			"		float DZ = gl_Vertex.z;   \n"
			"		if(DZ<= 0)								\n"
			"		{					\n"
			"			DZ = 0.01;			\n"
			"		}					\n"
			"		gl_FogFragCoord = length(vViewPosition.xyz-worldVertex.xyz);\n"
			"		const float LOG2 = 1.442695;\n"
			"		float d = 0.015*fog_density;	\n"
			"		float c = 1.0/50.0;	\n"

			"		gl_TexCoord[0] = gl_MultiTexCoord0; \n"
			"		float e_mid = d*exp(-c*vViewPosition.z); \n"

			"		float second = 1-(1/exp(c*DZ));\n"
			"		float last = c*DZ;\n"

			"		fogFactor = exp(-gl_FogFragCoord*LOG2*e_mid*second/last);	\n"
			"		fogFactor = clamp(fogFactor, 0.0, 1.0);               \n"
			"   }                                                \n";


        char fragmentSource[]=
            "   uniform samplerCube uEnvironmentMap;\n"
            "   uniform float dark_factor;\n"
            "   varying vec3 vTexCoord;\n"
			"   varying float fogFactor; \n"
			"	void main(void)    \n"
			"	{     \n"
			"    vec3 tex = vec3(vTexCoord.x, vTexCoord.y, -vTexCoord.z);\n"
			"		vec4 fogColor   = vec4(0.8,0.8,0.8,0.0);    \n"
			"		vec4 darkColor   = vec4(0.0,0.0,0.0,0.0);    \n"
			"		vec4 finalColor =  textureCube( uEnvironmentMap, tex.xzy ); \n"
			"		finalColor      = mix(fogColor, finalColor, fogFactor );   \n"
			"		gl_FragColor    = mix(darkColor, finalColor, dark_factor );   \n"
			"	} \n";

        program->setName( "sky_dome_shader" );
        program->addShader(new osg::Shader(osg::Shader::VERTEX,   vertexSource));
        program->addShader(new osg::Shader(osg::Shader::FRAGMENT, fragmentSource));
    }

    return program;
}
